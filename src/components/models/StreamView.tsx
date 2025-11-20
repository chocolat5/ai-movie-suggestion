import { useState } from "react";

import styled from "@emotion/styled";
import type { FormEvent } from "react";

import {
  ArrowUp as ArrowUpIcon,
  Asterisk as AsteriskIcon,
} from "@/components/ui/Icons";
import type { Message } from "@/types/types";
import { getStream } from "@/utils/api";

const StyledChatContainer = styled.div`
  position: relative;
  margin: 32px 8px;
  padding: 0 1.2rem;
  flex-grow: 1;
  /* overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable both-edges;
  scrollbar-width: thin;
  scrollbar-color: #ccc; */
`;

const StyledMessage = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;

  &:not(:first-of-type) {
    margin-top: 20px;
  }

  &.-user {
    justify-self: end;
    width: 70%;
  }

  &.-assistant {
    width: fit-content;
  }
`;

const StyledMessageWrap = styled.div`
  width: 100%;
`;

const StyledRole = styled.p`
  margin-bottom: 4px;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.2;
`;

const StyledMessageText = styled.div`
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 12px;
  font-size: 1.4rem;
  line-height: 1.6;
  &.-user {
    border-bottom-right-radius: 0;
  }
  &.-assistant {
    border-bottom-left-radius: 0;
  }
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

export function StreamView() {
  const [messages, setMessages] = useState<Message[]>([]);

  async function handleChat(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Read the form data
    const form = e.currentTarget;
    const formData = new FormData(form);
    const userInput = formData.get("user-input") as string;

    if (!userInput) return;

    // clear textarea
    e.currentTarget.reset();

    // update chats messages with user's input
    setMessages((prev) => [...prev, { role: "user", text: userInput.trim() }]);

    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: "", isLoading: true },
    ]);

    // sream and update the last message
    await getStream(userInput, (chunk) => {
      setMessages((prev) => {
        // copy array
        const newMessages = [...prev];
        // get last message
        const lastIndex = newMessages.length - 1;
        const lastMessage = newMessages[lastIndex];

        // add chunk to the last message
        newMessages[lastIndex] = {
          ...lastMessage,
          text: lastMessage.text + chunk,
          isLoading: false,
        };

        return newMessages;
      });
    });
  }

  return (
    <>
      {messages.length > 0 && (
        <StyledChatContainer>
          {messages.map((msg) => (
            <StyledMessage key={msg.text} className={`-${msg.role}`}>
              {msg.role === "assistant" && <AsteriskIcon />}
              <StyledMessageWrap>
                <StyledRole>{msg.role}</StyledRole>
                <StyledMessageText className={`-${msg.role}`}>
                  {msg.isLoading ? "..." : msg.text}
                </StyledMessageText>
              </StyledMessageWrap>
            </StyledMessage>
          ))}
        </StyledChatContainer>
      )}
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
    </>
  );
}
