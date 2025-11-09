// const request = async (endpoint: string, options: RequestInit = {}) => {
//   const url = `http://localhost:8787${endpoint}`;
import type { Recommendation } from "@/types/types";

//   const finalOptions = {
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     ...options,
//   };

//   if (
//     options.method &&
//     ["GET", "HEAD"].includes(options.method.toUpperCase())
//   ) {
//     delete finalOptions.body;
//   }

//   try {
//     // fetch
//     const response = await fetch(url, finalOptions);

//     if (!response.ok) {
//       throw new Error("Internal error");
//     }

//     return response.json();
//   } catch (error) {
//     console.error(error);
//     throw new Error("Internal error");
//   }
// };

// const apiClient = {
//   get: <T = unknown>(endpoint: string): Promise<T> => {
//     return request(endpoint, { method: "GET" });
//   },
//   // create
//   post: <T = unknown>(endpoint: string, data?: unknown): Promise<T> => {
//     return request(endpoint, { method: "POST", body: JSON.stringify(data) });
//   },
//   // update
//   put: <T = unknown>(endpoint: string, data: unknown): Promise<T> => {
//     return request(endpoint, { method: "PUT", body: JSON.stringify(data) });
//   },
//   delete: <T = unknown>(endpoint: string, data: unknown): Promise<T> => {
//     return request(endpoint, { method: "DELETE", body: JSON.stringify(data) });
//   },
// };

export const getChat = async (
  text: string
): Promise<{ recommendations: Recommendation[]; introText: string }> => {
  const response = await fetch("http://localhost:8787/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  // this is for return plane text
  // const textContent = data.response
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   .filter((block: any) => block.type === "text")
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   .map((block: any) => block.text)
  //   .join("");

  return {
    recommendations: data.recommendations || [],
    introText: data.introText,
  };
};

export const getStream = async (
  text: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const response = await fetch("http://localhost:8787/api/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader");

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    onChunk(chunk);
  }
};
