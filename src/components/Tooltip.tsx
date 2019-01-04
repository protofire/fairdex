import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content?: React.ReactNode;
}

const Tooltip = ({ children, content }: TooltipProps) => (
  <Container>
    {children}
    {content && <Content>{content}</Content>}
  </Container>
);

const Container = styled.div`
  position: relative;
`;

const Content = styled.div`
  --color-tooltip-error: #fce4e4;
  --color-tooltip-error-border: #fcc2c3;

  position: absolute;
  top: calc(100% + 3.5px);
  padding: var(--spacing-text);
  border-radius: 4px;
  background: #fce4e4;
  border: 1px solid #fcc2c3;
  color: var(--color-text-inverse);

  p {
    text-align: center;
    color: var(--color-text-primary);
  }

  a {
    font-weight: bold;
    text-decoration: underline;
  }

  // Arrow
  &:after,
  &:before {
    position: absolute;
    content: '';
    border: 7px solid transparent;
    right: var(--spacing-normal);
  }

  &:after {
    border-bottom: 7px solid var(--color-tooltip-error);
    top: -14px;
  }

  &:before {
    border-bottom: 7px solid var(--color-tooltip-error-border);
    top: -15px;
  }

  // Fade in animation
  animation: fadeIn;
  animation-duration: var(--animation-duration);
  animation-fill-mode: forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default Tooltip;
