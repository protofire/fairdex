import React from 'react';

import { Decimal, DecimalFormat, formatNumber } from '../../contracts/utils';

interface Props extends DecimalFormat {
  value?: Decimal;
  defaultValue?: string;
  showTitle?: boolean;
}

const DecimalValue = ({ value, defaultValue, decimals, showTitle, prefix, postfix }: Props) => (
  <span title={showTitle && value ? formatNumber(value, { prefix, postfix }) : undefined}>
    {value ? formatNumber(value, { decimals, prefix, postfix }) || defaultValue : ''}
  </span>
);

DecimalValue.defaultProps = {
  showTitle: true,
};

export default DecimalValue;
