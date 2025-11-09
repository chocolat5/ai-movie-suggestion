export type Bindings = {
  ANTHROPIC_API_KEY: string;
  TMDB_ACCESS_TOKEN: string;
  NODE_ENV: string;
};

export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  overview: string;
}
