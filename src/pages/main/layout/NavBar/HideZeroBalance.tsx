import React from 'react';
import styled from 'styled-components';

import Checkbox from '../../../../components/Checkbox';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: () => void;
}

const HideZeroBalance = ({ checked, onChange, ...props }: Props) => (
  <Label {...props}>
    <Checkbox name='hideZeroBalance' checked={checked} onChange={onChange} />
    Hide zero balances
  </Label>
);

const Label = styled.label`
  flex: 1 1 auto;
  font-size: 14px;
  letter-spacing: -0.4px;
  cursor: pointer;
  text-align: end;

  @media (max-width: 800px) {
    text-align: start;
  }
`;

export default HideZeroBalance;
