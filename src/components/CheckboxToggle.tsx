import React, { HTMLAttributes, useCallback } from 'react';
import styled, { css } from 'styled-components';

import Spinner from './Spinner';

interface ToggleProps extends HTMLAttributes<HTMLSpanElement> {
  checked: boolean | null;
  onToggle: (value: boolean) => void;
}

const CheckboxToggle = ({ checked, onToggle, ...props }: ToggleProps) => {
  const handleToggle = useCallback(() => onToggle(!checked), [checked, onToggle]);

  return (
    <Wrapper checked={checked} {...props} onClick={handleToggle}>
      {checked === null ? <Spinner size={'tiny'} /> : <Toggler />}
    </Wrapper>
  );
};

const Toggler = styled.span`
  position: absolute;
  left: 2px;
  top: 2px;
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  transition: transform var(--animation-duration) ease-in-out;
  will-change: transform;
`;

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 28px;
  height: 16px;
  border-radius: 12px;
  transition: background-color var(--animation-duration) ease-in-out;
  will-change: background-color;

  ${(props: Pick<ToggleProps, 'checked'>) =>
    props.checked === null
      ? css`
          background-color: var(--color-main-bg);

          ${Spinner} {
            left: 1rem;
          }
        `
      : props.checked
      ? css`
          background-color: var(--color-text-orange);

          ${Toggler} {
            transform: translateX(12px);
          }
        `
      : css`
          background-color: var(--color-text-secondary);

          ${Toggler} {
            transform: translateX(0);
          }
        `};
`;

export default CheckboxToggle;
