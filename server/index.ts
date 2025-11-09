import Anthropic from "@anthropic-ai/sdk";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamText } from "hono/streaming";

import { searchMovieTool } from "./tools/searchMovie";
import type { Bindings } from "./types/types";
import { searchMovies } from "./utils/tmdb";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.text("Hello Hono 🔥"));

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.get("/api/msg", async (c) => {
  const ai = new Anthropic({
    apiKey: c.env.ANTHROPIC_API_KEY,
  });

  const res = await ai.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    messages: [{ role: "user", content: "Hello, Claude" }],
  });

  return c.json(
    {
      status: "ok",
      message: res,
    },
    200
  );
});

app.post("/api/chat", async (c) => {
  console.log("=== POST /api/chat START ===");

  const ai = new Anthropic({
    apiKey: c.env.ANTHROPIC_API_KEY,
  });

  const { text } = await c.req.json();
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: text }];

  let iteration = 0;
  while (true) {
    iteration++;
    console.log(`\n--- Loop iteration ${iteration} ---`);

    /**
     * response の中身
     *   {
     *     "stop_reason": "tool_use" or "end_turn",
     *       "content": [
     *         { "type": "text", "text": "Let me search for those movies..." },
     *         { "type": "tool_use", "id": "toolu_123", "name": "search_movie", "input": { "query": "Interstellar" } }
     *       ]
     *     }
     */
    const response = await ai.messages.create({
      // model: "claude-sonnet-4-5",
      model: "claude-sonnet-4-0",
      // model: "claude-haiku-4-5",
      max_tokens: 1500,
      tools: [searchMovieTool],
      system: [
        {
          type: "text",
          text: `You are a movie recommendation expert. Today is ${new Date().toISOString().split("T")[0]}

          IMPORTANT WORKFLOW:
          1. When user mentions movie titles, use the search_movie tool to validate and get accurate information
          2. Search each movie title the user mentions
          3. Once you have confirmed the movies, analyze their taste and provide recommendations
          
          IMPORTANT INSTRUCTIONS:
          - Users may provide movie titles in ANY language (English, Japanese, etc.)
          - Always use search_movie tool to validate titles before making recommendations
          - If search returns multiple results, use context to pick the right one (or ask user)
          - Respond in the language the user is using

          Your goal: Provide personalized movie recommendations based on validated movie data.
          `,
        },
        // {
        //   type: "text",
        //   text: "You are a movie recommendation expert. Based on user's favorite movies, analyze their taste and suggest 3-5 similar movies they haven't seen. Include brief reasons for each recommendation.",
        // },
      ],
      messages: messages,
    });

    if (response.stop_reason === "tool_use") {
      console.log("Tool use detected!");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toolResults: any[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        const { query, year } = block.input as {
          query: string;
          year?: number;
        };
        console.log(`Searching for: ${query}`);

        // call searchMovies function
        const movieResults = await searchMovies(
          query,
          c.env.TMDB_ACCESS_TOKEN,
          year
        );

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(movieResults),
        });
      }

      // add assistant's response to messages
      messages.push({ role: "assistant", content: response.content });

      // add tool result to messages
      messages.push({
        role: "user",
        content: toolResults,
      });
      console.log("Messages after tool:", messages.length);
    } else {
      console.log("Returning final response");
      return c.json({ response: response.content });
    }

    if (iteration > 10) {
      console.log("Too many iterations, breaking!");
      return c.json({ error: "Too many iterations" }, 500);
    }
  }

  // return streamText(c, async (streamWriter) => {
  //   for await (const chunk of stream) {
  //     if (
  //       chunk.type === "content_block_delta" &&
  //       chunk.delta.type === "text_delta"
  //     ) {
  //       await streamWriter.write(chunk.delta.text);
  //     }
  //   }
  // });
});

app.post("/api/stream", async (c) => {
  console.log("POST /stream");

  const ai = new Anthropic({
    apiKey: c.env.ANTHROPIC_API_KEY,
  });

  const { text } = await c.req.json();

  const stream = ai.messages.stream({
    // model: "claude-sonnet-4-5",
    model: "claude-sonnet-4-0",
    // model: "claude-haiku-4-5",
    max_tokens: 500,
    system: [
      {
        type: "text",
        text: `You are a movie recommendation expert. Today is ${new Date().toISOString().split("T")[0]}

        IMPORTANT INSTRUCTIONS:
        - Users may provide movie titles in ANY language (English, Japanese, localized titles, etc.)
        - Example: "国宝" is a Japanese film, NOT Chinese
        - Carefully identify the actual movie regardless of title language
        - Respond in the language the user is using

        Analyze user's movie taste and suggest similar movies they might enjoy.

        If a movie title is ambiguous or could refer to multiple films:
        - Ask the user for clarification (year, director, or country)
        `,
      },
      // {
      //   type: "text",
      //   text: "You are a movie recommendation expert. Based on user's favorite movies, analyze their taste and suggest 3-5 similar movies they haven't seen. Include brief reasons for each recommendation.",
      // },
      // {
      //   type: "text",
      //   text: "You are an enthusiastic movie buff who loves sharing hidden gems. Recommend movies with brief, engaging descriptions that spark curiosity.",
      // },
    ],
    messages: [
      {
        role: "user",
        content: text,
      },
    ],
  });

  return streamText(c, async (streamWriter) => {
    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        // return plain text
        await streamWriter.write(chunk.delta.text);
      }
    }
  });
});

export default app;
