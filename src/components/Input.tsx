import React from 'react';
import styled from 'styled-components';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = (props: InputProps) => (
  <Wrapper>
    <Control {...props} />
  </Wrapper>
);

const Wrapper = styled.div`
  height: var(--input-height);
  background-color: var(--color-content-bg);
  border-radius: 4px;
  padding: 12px 10px;
  overflow: hidden;

  &:focus {
    background-color: #eaeff3;
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
    opacity: 0.5;
  }
`;

export default Input;
