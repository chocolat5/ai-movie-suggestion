export const recommendationsTool = {
  name: "movie_recommendations",
  description: "Provide movie recommendations based on user's taste",
  input_schema: {
    type: "object" as const,
    properties: {
      introText: {
        type: "string",
        description:
          "A welcoming introduction text that summarizes the user's interests or preferences (NOT specific movie titles they mentioned) and states how many recommendations are being provided. Format: 'Based on your interest in [themes/genres/mood], here are {number} movie recommendations for you:'",
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description:
                "Original international title (usually English). Do NOT use translated/localized titles.",
            },
            year: { type: "number" },
            reason: { type: "string" },
            matchPercentage: {
              type: "number",
              description:
                "Match percentage (86 - 100), at least one or two should be 90%+, should not include matches less than 85%",
            },
          },
          required: ["title", "year", "reason", "matchPercentage"],
        },
        minItems: 4,
        maxItems: 6,
      },
    },
    required: ["recommendations", "introText"],
  },
};
