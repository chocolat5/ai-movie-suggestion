import styled from "@emotion/styled";

const StyledTabBar = styled.div`
  display: flex;
  gap: 8px;
  margin: 24px 0;
`;

const StyledTab = styled.button<{ isActive: boolean }>`
  padding: 4px 12px;
  background: none;
  border: none;
  border: 1px solid
    ${(props) => (props.isActive ? "var(--primary)" : "rgba(0, 0, 0, 0)")};
  background-color: ${(props) => (props.isActive ? "var(--primary)" : "none")};
  border-radius: 2.5em;
  font-size: 1.4rem;
  font-weight: 400;
  color: ${(props) => (props.isActive ? "#fff" : "var(--primary)")};
  cursor: pointer;
`;
interface TabBarProps {
  current: "stream" | "chat";
  onViewChange: (view: "stream" | "chat") => void;
}

export function TabBar({ current, onViewChange }: TabBarProps) {
  return (
    <StyledTabBar>
      <StyledTab
        isActive={current === "chat"}
        onClick={() => onViewChange("chat")}
      >
        Chat
      </StyledTab>
      <StyledTab
        isActive={current === "stream"}
        onClick={() => onViewChange("stream")}
      >
        Stream
      </StyledTab>
    </StyledTabBar>
  );
}
