import React from 'react';
import styled, { css } from 'styled-components';

import Icon from './icons';

interface DialogProps {
  animate?: boolean;
  children: React.ReactNode;
  onBack?: (...args: any) => void | null;
  title?: string | null;
  theme?: 'accent' | null;
}

const Dialog = ({ children, onBack, title, ...props }: DialogProps) => (
  <Tooltip {...props}>
    {title && (
      <Title>
        <BackButton onClick={onBack} />
        <h4>{title}</h4>
      </Title>
    )}
    <Content>{children}</Content>
  </Tooltip>
);

const Tooltip = styled.div`
  position: absolute;
  font-size: 0.875rem;
  line-height: 1rem;
  background-color: var(--color-main-bg);
  border-radius: 8px;
  box-shadow: 0 4px 40px 4px rgba(48, 59, 62, 0.3);

  &:after {
    position: absolute;
    display: block;
    content: '';
    width: 0;
    bottom: -7.5px;
    left: 45%;
    border-style: solid;
    border-width: 7.5px 10px 0;
    border-color: var(--color-main-bg) transparent;
  }

  ${({ theme }: DialogProps) => {
    switch (theme) {
      case 'accent':
        return css`
          background-color: #fff0e2;

          &:after {
            border-color: #fff0e2 transparent;
          }
        `;

      default:
        return null;
    }
  }};
`;

const BackButton = styled(Icon.Back)`
  cursor: pointer;
`;

const Container = styled.div`
  position: relative;

  ${Tooltip} {
    position: absolute;
    bottom: calc(100% + 15px);
    width: calc(100% + 2 * var(--spacing-normal));
    left: calc(var(--spacing-normal) * -1);
  }
`;

const Content = styled.div`
  p {
    margin: 0 0 var(--spacing-normal);
    padding: 0 var(--spacing-narrow);
    line-height: 1.14;
    letter-spacing: -0.4px;
  }
`;

const Title = styled.header`
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(var(--spacing-title) * 2);
  border-bottom: 1px solid var(--color-border);
  user-select: none;

  h4 {
    line-height: var(--header-height);
    text-align: center;
    text-transform: uppercase;
    flex: 1;
  }
`;

export default { Container, Dialog };
