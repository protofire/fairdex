import React, { HTMLAttributes, useCallback } from 'react';
import styled from 'styled-components';

import checkboxChecked from '../images/checkbox_checked.svg';
import checkboxUnchecked from '../images/checkbox_unchecked.svg';

interface CheckboxProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  checked: boolean;
  onToggle: (name: string, checked: boolean) => void;
}

const Checkbox = ({ name, checked, onToggle, ...props }: CheckboxProps) => {
  const handleToggle = useCallback(() => onToggle(name, !checked), [checked, onToggle]);

  return (
    <span {...props}>
      <span />
      <input type='checkbox' name={name} onChange={handleToggle} />
    </span>
  );
};

export default styled(Checkbox)`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 14px;
  height: 14px;
  margin-right: var(--spacing-text);
  cursor: default;
  overflow: hidden;

  & > span:first-child {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff url(${props => (props.checked ? checkboxChecked : checkboxUnchecked)}) no-repeat center;
  }

  input[type='checkbox'] {
    position: absolute;
    opacity: 0;
  }
`;
