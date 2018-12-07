import React from 'react';

interface Props {
  value: number | string;
  decimals?: number;
  defaultValue?: string;
}

const Numeric = ({ value, defaultValue, decimals }: Props) => {
  const n = Number(value);

  return <span>{Number.isFinite(n) ? parseFloat(n.toFixed(decimals)) : defaultValue}</span>;
};

Numeric.defaultProps = {
  defaultValue: '-',
  decimals: 18
};

export default Numeric;
