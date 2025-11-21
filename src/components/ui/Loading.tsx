import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--c-primary);
  border-right-color: var(--c-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const Loading = () => {
  return <StyledSpinner />;
};
