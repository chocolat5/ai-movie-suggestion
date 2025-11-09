import { useState } from "react";
import type { FormEvent } from "react";

import styled from "@emotion/styled";

import { ArrowUp as ArrowUpIcon } from "@/components/ui/Icons";
import { MovieCard } from "@/components/ui/MovieCard";
import type { AssistantMessage } from "@/types/types";
import { getChat } from "@/utils/api";

const StyledMessageText = styled.div`
  margin: 24px 0;
  font-size: 1.4rem;
  line-height: 1.6;
`;

const StyledFormWrap = styled.div`
  position: sticky;
  bottom: 0;
  padding-bottom: 12px;
  background-color: var(--base);
`;

const StyledForm = styled.form`
  display: grid;
  padding: 12px;
  background-color: #fff;
  border: 2px solid var(--primary);
  border-radius: 12px;
`;

const StyledTextarea = styled.textarea`
  grid-column: 1 / -1;
  &:focus {
    outline: none;
  }
`;

const StyledButton = styled.button`
  grid-column: 1 / -1;
  align-self: end;
  justify-self: end;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid var(--primary);
  cursor: pointer;
  z-index: 1;

  &[disabled] {
    cursor: default;
    opacity: 0.6;
  }
`;

const StyledList = styled.div`
  display: grid;
  gap: 20px;
`;

export function ChatView() {
  const [result, setResult] = useState<AssistantMessage | null>(null);

  async function handleChat(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Read the form data
    const form = e.currentTarget;
    const formData = new FormData(form);
    const userInput = formData.get("user-input") as string;

    if (!userInput) return;

    // clear textarea
    // e.currentTarget.reset();

    // Add empty assistant message
    setResult({ role: "assistant", introText: "", isLoading: true });

    // sream and update the last message
    const res = await getChat(userInput);

    setResult({
      role: "assistant",
      recommendations: res.recommendations,
      introText: res.introText,
      isLoading: false,
    });
  }

  return (
    <>
      <StyledFormWrap>
        <StyledForm method="post" onSubmit={handleChat}>
          <StyledTextarea
            placeholder="Message..."
            name="user-input"
            rows={4}
            required
          />
          <StyledButton aria-label="Send">
            <ArrowUpIcon />
          </StyledButton>
        </StyledForm>
      </StyledFormWrap>
      {result && (
        <>
          {result.isLoading ? (
            <StyledMessageText>Preparing recommendations...</StyledMessageText>
          ) : (
            <>
              {result.recommendations && (
                <>
                  <StyledMessageText>{result.introText}</StyledMessageText>
                  <StyledList>
                    {result?.recommendations.map((r) => (
                      <MovieCard key={r.title} movie={r} />
                    ))}
                  </StyledList>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
