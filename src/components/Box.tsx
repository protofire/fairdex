import React from 'react';
import styled, { css } from 'styled-components';

interface BoxProps {
  theme: 'accent' | 'default';
}

const Box = styled.div`
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

    border-style: solid;
    border-width: calc(var(--box-arrow-height) * 0.75) var(--box-arrow-height) 0;
    border-color: var(--color-main-bg) transparent;

    bottom: calc(var(--box-arrow-height) * -0.75);
    left: calc(50% - var(--box-arrow-height));
  }

  ${({ theme }: BoxProps) => {
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

Box.defaultProps = {
  theme: 'default',
};

export default Box;
