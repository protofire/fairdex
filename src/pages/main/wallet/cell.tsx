import React from 'react';
import styled, { css } from 'styled-components';
import { DecimalValue } from '../../../components/formatters';

const bordeMixin = border => `border-${border}: 1px solid rgba(255, 255, 255, 0.2);`;

const Cell = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${css`
    ${({ borders }) => (borders ? borders.map(bordeMixin).join('') : '')}
  `}
`;

export default Cell;

const ValueMixin = css`
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 0.9;
  letter-spacing: normal;
  color: #ffffff;
`;

export const DecimalContent = styled(DecimalValue)`
  ${ValueMixin}
`;

export const IntContent = styled.div`
  ${ValueMixin}
`;

export const Description = styled.div`
  font-size: 12px;
  font-weight: normal;
  color: var(--color-text-primary);
  padding-top: 5px;
`;
