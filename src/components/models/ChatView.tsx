import { useRef, useState } from "react";

import styled from "@emotion/styled";
import type { FormEvent } from "react";
import { flushSync } from "react-dom";

import { MailSend as MailSendIcon } from "@/components/ui/Icons";
import { Loading } from "@/components/ui/Loading";
import { MovieCard } from "@/components/ui/MovieCard";
import type { AssistantMessage } from "@/types/types";
import { getChat } from "@/utils/api";

const StyledLoading = styled.div`
  display: flex;
  gap: var(--sp-md);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: var(--sp-md) 0 0;
`;

const StyledLoadingMessage = styled.p`
  font-size: var(--fs-md);
`;

const StyledIntroText = styled.p`
  margin: 0 0 var(--sp-lg);
  font-size: var(--fs-md);
`;

const StyledFormWrap = styled.div`
  max-width: var(--container-sm);
  margin: 0 auto;
`;

const StyledForm = styled.form`
  display: grid;
  padding: var(--sp-md);
  background-color: var(--c-bg-alt);
  border: 2px solid var(--primary);
  border-radius: var(--radius-xl);
`;

const StyledTextarea = styled.textarea`
  grid-column: 1 / -1;
  resize: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--c-text-light);
  }

  &:disabled {
    background-color: var(--c-bg-alt);
    opacity: 0.5;
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
    opacity: 0.5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StyledResultWrap = styled.div`
  max-width: var(--container-lg);
  min-height: 100vh;
  margin: 0 auto;
  padding: var(--sp-lg) var(--sp-xl);
`;

const StyledList = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;

  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export function ChatView() {
  const [result, setResult] = useState<AssistantMessage | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  async function handleChat(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Read the form data
    const form = e.currentTarget;
    const formData = new FormData(form);
    const userInput = formData.get("user-input") as string;

    if (!userInput) return;

    // Add empty assistant message
    setResult({ role: "assistant", introText: "", isLoading: true });

    // sream and update the last message
    const res = await getChat(userInput);

    flushSync(() => {
      setResult({
        role: "assistant",
        recommendations: res.recommendations,
        introText: res.introText,
        isLoading: false,
      });
    });

    // window scroll
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <StyledFormWrap>
        <StyledForm method="post" onSubmit={handleChat}>
          <StyledTextarea
            placeholder="Interstellar, Kokuho (2025) ..."
            name="user-input"
            rows={4}
            required
            disabled={result?.isLoading}
          />
          <StyledButton aria-label="Send" disabled={result?.isLoading}>
            <MailSendIcon />
          </StyledButton>
        </StyledForm>
      </StyledFormWrap>
      {result && (
        <>
          {result.isLoading ? (
            <StyledLoading>
              <StyledLoadingMessage>
                Preparing recommendations...
              </StyledLoadingMessage>
              <Loading />
            </StyledLoading>
          ) : (
            <StyledResultWrap ref={targetRef}>
              {result.recommendations && (
                <>
                  <StyledIntroText>{result.introText}</StyledIntroText>
                  <StyledList>
                    {result?.recommendations.map((r) => (
                      <MovieCard key={r.title} movie={r} />
                    ))}
                  </StyledList>
                </>
              )}
            </StyledResultWrap>
          )}
        </>
      )}
    </>
  );
}
