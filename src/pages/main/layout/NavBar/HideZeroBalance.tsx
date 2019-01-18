import React from 'react';
import styled from 'styled-components';

import Checkbox from '../../../../components/Checkbox';

interface Props extends React.HTMLAttributes<HTMLLabelElement> {
  checked: boolean;
  onToggle: (_: any, searchMode: boolean) => void;
}

const HideZeroBalance = ({ checked, onToggle, ...props }: Props) => (
  <Label {...props} data-testid={'hide-zero-balance'}>
    <Checkbox name='hideZeroBalance' checked={checked} onToggle={onToggle} />
    Hide zero balances
  </Label>
);

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  letter-spacing: -0.4px;
  cursor: pointer;
  user-select: none;
`;

export default HideZeroBalance;
