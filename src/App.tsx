import styled from "@emotion/styled";

import { ChatView } from "@/components/models/ChatView";
import { Movie as MovieIcon } from "@/components/ui/Icons";

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  max-width: var(--container-sm);
  margin: 0 auto;
  padding: var(--sp-3xl) var(--sp-xl) 0;
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

const StyledChatContainer = styled.div`
  margin: var(--sp-xl) 0 0;
`;

function App() {
  return (
    <>
      <StyledContainer>
        <StyledTitle>
          <MovieIcon />
          AI Movie Suggestion
        </StyledTitle>
        <StyledText>
          Type your favorite movies from all time or movies you liked recently.
          <br />
          Get movies to watch next!
        </StyledText>
      </StyledContainer>
      <StyledChatContainer>
        <ChatView />
      </StyledChatContainer>
    </>
  );
}

export default App;
