import type { AIRecommendation, Recommendation } from "../types/types";
import { searchMovies } from "./tmdb";

export async function enrichRecommendations(
  recommendations: AIRecommendation[],
  tmdbToken: string
): Promise<Recommendation[]> {
  const enriched = await Promise.all(
    recommendations.map(async (rec) => {
      // Search without year for better results
      const tmdbResults = await searchMovies(rec.title, tmdbToken);

      // Find the result with closest year match
      let tmdbData = tmdbResults[0];
      if (tmdbResults.length > 1) {
        // Try to find exact or close year match
        const closeMatch = tmdbResults.find((movie) => {
          return Math.abs(movie.year - rec.year) <= 1; // ±1 year tolerance
        });
        if (closeMatch) {
          tmdbData = closeMatch;
        }
      }

      if (tmdbData) {
        return {
          title: tmdbData.title,
          year: rec.year,
          posterPath: tmdbData.posterPath,
          genres: tmdbData.genres,
          reason: rec.reason,
          matchPercentage: rec.matchPercentage,
        };
      }

      // Fallback if TMDB search fails
      return {
        title: rec.title,
        year: rec.year,
        posterPath: "",
        genres: [],
        reason: rec.reason,
        matchPercentage: rec.matchPercentage,
      };
    })
  );

  return enriched;
}
