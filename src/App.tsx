import { useState } from "react";

import styled from "@emotion/styled";

import { ChatView } from "@/components/models/ChatView";
import { StreamView } from "@/components/models/StreamView";
import { TabBar } from "@/components/ui/TabBar";

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  max-width: 720px;
  /* height: 100vh; */
  margin: 0 auto;
  padding: 6.4rem 3.2rem;
`;

const StyledTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 600;
  text-align: center;
`;

function App() {
  const [view, setView] = useState<"stream" | "chat">("chat");

  return (
    <StyledContainer>
      <StyledTitle>AI Movie Suggestion</StyledTitle>
      <p>
        Type your favorite movies from all time or movies you liked recently
      </p>
      <div>
        <TabBar current={view} onViewChange={setView} />
        {view === "chat" ? <ChatView /> : <StreamView />}
      </div>
    </StyledContainer>
  );
}

export default App;
