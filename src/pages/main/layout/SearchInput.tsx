import React, { HTMLAttributes, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import Close from '../../../components/icons/Close';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onClose: () => void;
}

const Input = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <span className={className}>
      <input type='text' className='input' {...rest} />
      <Close onClick={props.onClose} className='icon' />
    </span>
  );
};

export default styled(Input)`
  display: flex;
  flex-flow: row nowrap;
  color: var(--color-greyish);
  background-color: var(--color-content-bg);
  padding: 0.3rem 0.5rem;
  border-radius: 4px;

  .input {
    border: 0;
    padding: 0;
    background-color: transparent;
    flex: 1 1 auto;
    font-size: 0.8rem;

    &:focus {
      outline: 0;
    }
  }

  .icon {
    cursor: pointer;
  }
`;
