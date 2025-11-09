export type Bindings = {
  ANTHROPIC_API_KEY: string;
  TMDB_ACCESS_TOKEN: string;
  NODE_ENV: string;
};

export interface Movie {
  id: number;
  title: string;
  year: number;
  posterPath: string;
  genres: string[];
}

export interface AIRecommendation {
  title: string;
  year: number;
  reason: string;
  matchPercentage: number;
}
export interface Recommendation {
  title: string;
  year: number;
  posterPath: string;
  genres: string[];
  reason: string;
  matchPercentage: number;
}
