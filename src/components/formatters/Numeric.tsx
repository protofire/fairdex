import React from 'react';

interface Props {
  value: number;
  decimals?: number;
  defaultValue?: string;
}

const Numeric = ({ value, defaultValue, decimals }: Props) => (
  <span>{Number.isFinite(value) ? parseFloat(value.toFixed(decimals)) : defaultValue}</span>
);

Numeric.defaultProps = {
  defaultValue: '-',
  decimals: 18
};

export default Numeric;
