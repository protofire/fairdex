import { BigNumber } from 'bignumber.js';
import React from 'react';

interface Props {
  value: number | string;
  decimals?: number;
  defaultValue?: string;
}

const Numeric = ({ value, defaultValue, decimals = 18 }: Props) => {
  const n = new BigNumber(value);

  return <span>{n.isFinite() ? parseFloat(n.toFixed(decimals)) : defaultValue}</span>;
};

Numeric.defaultProps = {
  defaultValue: '-',
};

export default Numeric;
