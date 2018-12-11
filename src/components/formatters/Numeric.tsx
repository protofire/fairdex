import { BigNumber } from 'bignumber.js';
import React from 'react';

interface Props {
  value: number | string;
  decimals?: number;
  defaultValue?: string;
  prefix?: string;
  postfix?: string;
  showTitle?: boolean;
}

const Numeric = ({ value, defaultValue, decimals = 18, showTitle, ...props }: Props) => {
  const val = new BigNumber(value);
  const rawValue = showTitle ? (val.isFinite() ? val.toString() : defaultValue) : null;
  const formatted = val.isFinite() ? parseFloat(val.toFixed(decimals)) : defaultValue;

  const prefix = props.prefix ? props.prefix + ' ' : '';
  const postfix = props.postfix ? ' ' + props.postfix : '';

  return (
    <span title={`${prefix}${rawValue}${postfix}`}>
      {prefix}
      {formatted}
      {postfix}
    </span>
  );
};

Numeric.defaultProps = {
  defaultValue: '-',
  showTitle: true,
};

export default Numeric;
