// const request = async (endpoint: string, options: RequestInit = {}) => {
//   const url = `http://localhost:8787${endpoint}`;
import type { Recommendation } from "@/types/types";

export const getChat = async (
  text: string
): Promise<{ recommendations: Recommendation[]; introText: string }> => {
  const response = await fetch("http://localhost:8787/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  return {
    recommendations: data.recommendations || [],
    introText: data.introText,
  };
};
