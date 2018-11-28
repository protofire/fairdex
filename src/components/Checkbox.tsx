import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import checkboxChecked from '../images/checkbox_checked.svg';
import checkboxUnchecked from '../images/checkbox_unchecked.svg';

interface Props {
  checked: boolean;
  className?: string;
  onChange: () => void;
}

const Checkbox = (props: Props) => <span onClick={props.onChange} className={props.className} />;

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
