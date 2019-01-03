import React from 'react';
import styled from 'styled-components';

import checkboxChecked from '../images/checkbox_checked.svg';
import checkboxUnchecked from '../images/checkbox_unchecked.svg';

interface Props {
  isOn: boolean;
  className?: string;
  onChange: (name: string, checked: boolean) => void;
}

class Toggle extends React.PureComponent<Props> {
  render() {
    const { className, isOn } = this.props;

    return (
      <Wrapper className={`${className} ${isOn ? 'toggle__on' : 'toggle__off'}`} onClick={this.toggle}>
        <Toggler />
      </Wrapper>
    );
  }

  private toggle = (e: any) => {
    this.props.onChange(!this.props.isOn);
  };
}

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
`;

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 28px;
  height: 16px;
  border-radius: 12px;
  transition: background-color var(--animation-duration) ease-in-out;

  &.toggle__off {
    background-color: var(--color-text-secondary);

    ${Toggler} {
      transform: translateX(0);
    }
  }

  &.toggle__on {
    background-color: var(--color-text-orange);

    ${Toggler} {
      transform: translateX(12px);
    }
  }
`;

export default Toggle;
