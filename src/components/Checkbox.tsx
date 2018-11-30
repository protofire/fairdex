import React from 'react';
import styled from 'styled-components';

import checkboxChecked from '../images/checkbox_checked.svg';
import checkboxUnchecked from '../images/checkbox_unchecked.svg';

interface Props {
  name: string;
  checked: boolean;
  className?: string;
  onChange: (name: string, checked: boolean) => void;
}

class Checkbox extends React.PureComponent<Props> {
  render() {
    return (
      <span className={this.props.className}>
        <span className='dummyBox' />
        <input type='checkbox' name={this.props.name} className='checkbox' onChange={this.toggle} />
      </span>
    );
  }

  private toggle = (e: any) => {
    this.props.onChange(this.props.name, !this.props.checked);
  };
}

export default styled(Checkbox)`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 14px;
  height: 14px;
  margin-right: var(--spacing-text);
  cursor: default;
  overflow: hidden;

  .checkbox {
    position: absolute;
    opacity: 0;
  }

  .dummyBox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff url(${props => (props.checked ? checkboxChecked : checkboxUnchecked)}) no-repeat center;
  }
`;
