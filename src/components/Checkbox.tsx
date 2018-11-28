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
    return <span onClick={this.toggle} className={this.props.className} />;
  }

  private toggle = (e: any) => {
    this.props.onChange(this.props.name, !this.props.checked);
  };
}

export default styled(Checkbox)`
  display: inline-block;
  vertical-align: middle;
  width: 14px;
  height: 14px;
  margin-right: var(--spacing-text);
  background: url(${props => (props.checked ? checkboxChecked : checkboxUnchecked)}) no-repeat center;
  cursor: default;
  user-select: none;
`;
