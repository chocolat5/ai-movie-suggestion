import styled from "@emotion/styled";

import { ChatView } from "@/components/models/ChatView";
import { Movie as MovieIcon } from "@/components/ui/Icons";

const StyledWrap = styled.div`
  padding: var(--sp-3xl) var(--sp-xl);
`;

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  max-width: var(--container-sm);
  margin: 0 auto;
`;

const StyledTitle = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-sm);
  font-size: var(--fs-xl);
  font-weight: 600;
  text-align: center;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const StyledText = styled.p`
  margin: var(--sp-md) 0 0;
  font-size: var(--fs-md);
`;

const StyledTextTips = styled.p`
  color: var(--c-text-sub);
  font-size: var(--fs-sm);
`;

const StyledChatContainer = styled.div`
  margin: var(--sp-xl) 0 0;
`;

function App() {
  return (
    <StyledWrap>
      <StyledContainer>
        <StyledTitle>
          <MovieIcon />
          AI Movie Suggestion
        </StyledTitle>
        <StyledText>
          Type your favorite movies from all time or movies you liked recently.
          Get movies to watch next!
        </StyledText>
        <StyledTextTips>
          Tip: Include release years or other details for more accurate
          suggestions (e.g., Kokuho (2025, Japanese) ).
        </StyledTextTips>
      </StyledContainer>
      <StyledChatContainer>
        <ChatView />
      </StyledChatContainer>
    </StyledWrap>
  );
}

export default App;
