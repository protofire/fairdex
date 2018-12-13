import React from 'react';

import { Decimal, DecimalFormat, formatNumber } from '../../contracts/utils';

interface Props extends DecimalFormat {
  value: Decimal;
  defaultValue?: string;
  showTitle?: boolean;
}

const Numeric = ({ value, defaultValue, decimals, showTitle, prefix, postfix }: Props) => (
  <span title={showTitle ? formatNumber(value, { prefix, postfix }) : undefined}>
    {formatNumber(value, { decimals, prefix, postfix }) || defaultValue}
  </span>
);

Numeric.defaultProps = {
  defaultValue: '-',
  showTitle: true,
};

export default Numeric;
