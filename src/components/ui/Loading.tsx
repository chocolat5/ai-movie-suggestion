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
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--c-primary);
  border-right-color: var(--c-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  &.-small {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }

  &.-medium {
    width: 32px;
    height: 32px;
  }
`;

interface LoadingProps {
  size?: "small" | "medium";
}

export const Loading = ({ size = "medium" }: LoadingProps) => {
  return <StyledSpinner className={`-${size}`} />;
};
