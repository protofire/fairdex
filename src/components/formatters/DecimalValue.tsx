import React from 'react';

import styled from 'styled-components';
import { Decimal, DecimalFormat, formatNumber } from '../../contracts/utils';

interface Props extends DecimalFormat {
  value?: Decimal;
  defaultValue?: string;
  hideTitle?: boolean;
  className?: string;
}

const DecimalValue = ({ className, value, defaultValue, decimals, hideTitle, prefix, postfix }: Props) => (
  <Wrapper
    className={className}
    title={!hideTitle && value ? formatNumber(value, { prefix, postfix }) : undefined}
  >
    {value ? formatNumber(value, { decimals, prefix, postfix }) || defaultValue : ''}
  </Wrapper>
);

const Wrapper = styled.span`
  white-space: nowrap;
`;

export default DecimalValue;
