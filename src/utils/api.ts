export const getChat = async (text: string): Promise<string> => {
  const response = await fetch("http://localhost:8787/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  const textContent = data.response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((block: any) => block.type === "text")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((block: any) => block.text)
    .join("");

  return textContent;
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
