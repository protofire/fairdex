import React from 'react';
import styled from 'styled-components';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ left, right, ...props }: InputProps, ref) => (
  <Wrapper {...props}>
    {left && <Left>{left}</Left>}
    <Control ref={ref} {...props} />
    {right && <Right>{right}</Right>}
  </Wrapper>
));

const Wrapper = styled.div`
  display: inline-flex;
  height: var(--input-height);
  background: var(--color-content-bg);
  border-radius: 4px;
  padding: 12px 10px;
  overflow: hidden;

  &:focus {
    background-color: #eaeff3;
  }

  input {
    flex: 1;
  }
`;

const Control = styled.input`
  width: 100%;
  border: none;
  background: transparent;

  &:focus {
    outline: none;
  }

  &:read-only {
    color: var(--color-text-secondary);
  }
`;

const Left = styled.span`
  margin-right: var(--spacing-text);
`;

const Right = styled.span`
  margin-left: var(--spacing-text);
`;

export default Input;
