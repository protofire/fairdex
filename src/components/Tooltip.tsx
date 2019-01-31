import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content?: React.ReactNode;
  position: 'bottom' | 'bottom left' | 'bottom right';
  theme?: 'error' | 'default';
}

const Tooltip = ({ children, content, ...props }: TooltipProps) => (
  <Container>
    {children}
    {content && <Content {...props}>{content}</Content>}
  </Container>
);

Tooltip.defaultProps = {
  theme: 'default',
  position: 'bottom',
};

const Container = styled.div`
  position: relative;
`;

const Content = styled.div`
  --color-tooltip: ${({ theme }: TooltipProps) => (theme === 'error' ? '#fce4e4' : 'black')};
  --color-tooltip-border: ${({ theme }: TooltipProps) => (theme === 'error' ? '#fcc2c3' : 'black')};

  position: absolute;
  width: 100%;
  top: calc(100% + 3.5px);
  padding: var(--spacing-text);
  border-radius: 4px;

  font-size: 0.8rem;
  font-weight: normal;
  text-align: center;

  &&& {
    background: var(--color-tooltip);
    border: 1px solid var(--color-tooltip-border);
    color: var(--color-text-inverse);
  }

  p {
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

    ${({ position }: TooltipProps) => {
      switch (position) {
        case 'bottom':
          return css`
            right: calc(50% - 7.5px);
          `;

        case 'bottom left':
          return css`
            right: calc(75% - 7.5px);
          `;

        case 'bottom right':
          return css`
            right: calc(25% - 7.5px);
          `;
      }
    }};
  }

  &:after {
    border-bottom: 7px solid var(--color-tooltip);
    top: -14px;
  }

  &:before {
    border-bottom: 7px solid var(--color-tooltip-border);
    top: -15px;
  }

  // Fade in animation
  animation: tooltipFadeIn;
  animation-duration: var(--animation-duration);
  animation-fill-mode: forwards;

  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default Tooltip;
