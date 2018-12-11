import { BigNumber } from 'bignumber.js';
import React from 'react';

interface Props {
  value: number | string;
  decimals?: number;
  defaultValue?: string;
  showTitle?: boolean;
}

const Numeric = ({ value, defaultValue, decimals = 18, showTitle }: Props) => {
  const val = new BigNumber(value);
  const raw = showTitle ? (val.isFinite() ? val.toString() : defaultValue) : '';
  const formatted = val.isFinite() ? parseFloat(val.toFixed(decimals)) : defaultValue;

  return <span title={raw}>{formatted}</span>;
};

Numeric.defaultProps = {
  defaultValue: '-',
  showTitle: true,
};

export default Numeric;
