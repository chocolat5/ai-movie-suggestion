import Anthropic from "@anthropic-ai/sdk";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { recommendationsTool } from "./tools/recommendations";
import { searchMovieTool } from "./tools/searchMovie";
import type { AIRecommendation, Bindings } from "./types/types";
import { enrichRecommendations } from "./utils/helpers";
import { searchMovies } from "./utils/tmdb";

// const model = "claude-sonnet-4-5";
const model = "claude-sonnet-4-0";
// const model = "claude-haiku-4-5";
const maxTokens = 1000;

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
    model,
    max_tokens: maxTokens,
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
      model,
      max_tokens: maxTokens,
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
      ],
      messages: messages,
    });

    // get movies information using tool
    if (response.stop_reason === "tool_use") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toolResults: any[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        const { query, year } = block.input as {
          query: string;
          year?: number;
        };

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
    } else {
      console.log("Getting structured recommendations...");
      break;
    }

    if (iteration > 10) {
      return c.json({ error: "Too many iterations" }, 500);
    }
  }

  // create response
  const finalResponse = await ai.messages.create({
    model,
    max_tokens: maxTokens,
    tools: [recommendationsTool],
    tool_choice: { type: "tool", name: "movie_recommendations" },
    system: [
      {
        type: "text",
        text: `Based on the validated movies, provide 5 - 8 personalized recommendations in the same language as the user.

        IMPORTANT: Do NOT include any movies that the user already mentioned in their input. Only recommend NEW movies they haven't seen or mentioned.`,
      },
    ],
    messages,
  });

  // extract the tool input as structured JSON
  const toolUse = finalResponse.content.find(
    (block) => block.type === "tool_use"
  );
  if (toolUse && toolUse.type === "tool_use") {
    const aiData = toolUse.input as {
      introText: string;
      recommendations: AIRecommendation[];
    };
    const recommendations = await enrichRecommendations(
      aiData.recommendations,
      c.env.TMDB_ACCESS_TOKEN
    );
    return c.json({
      introText: aiData.introText,
      recommendations,
    });
  }

  return c.json({ error: "Failed to generate recommendations" }, 500);
});

export default app;
