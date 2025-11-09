export interface Recommendation {
  id: number;
  title: string;
  year: number;
  posterPath: string;
  genres: string[];
  reason: string;
  matchPercentage: number;
}

export type UserMessage = {
  role: "user";
  text: string;
};

export type AssistantMessage = {
  role: "assistant";
  recommendations?: Recommendation[];
  introText?: string;
  isLoading?: boolean;
};

export type Message = UserMessage | AssistantMessage;
