export const searchMovieTool = {
  name: "search_movie",
  description:
    "Search for a movie by title to get accurate information. Use this when user mentions a movie title.",
  input_schema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "The movie titke to search for",
      },
      year: {
        type: "number",
        description: "Optional release year to narrow down search results",
      },
    },
    required: ["query"],
  },
};
