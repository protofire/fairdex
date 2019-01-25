import React, { HTMLAttributes } from 'react';

import styled from 'styled-components';
import { Decimal, DecimalFormat, formatNumber, toBigNumber } from '../../contracts/utils';

interface Props extends DecimalFormat, HTMLAttributes<HTMLSpanElement> {
  value?: Decimal;
  defaultValue?: string;
  hideTitle?: boolean;
}

const DecimalValue = ({
  className,
  value,
  defaultValue,
  decimals,
  hideTitle,
  prefix,
  postfix,
  roundingMode,
  ...props
}: Props) => {
  let formattedValue = <>{value && formatNumber(value, { decimals, prefix, postfix, roundingMode })}</>;

  if (value && toBigNumber(value).gt(0) && formatNumber(value, { decimals, roundingMode }) === '0') {
    formattedValue = (
      <>
        {`${prefix ? prefix + ' ' : ''}0.0`}
        <Ellipsis />
        {`${postfix ? ' ' + postfix : ''}`}
      </>
    );
  }

  return (
    <Wrapper
      {...props}
      title={!hideTitle && value ? formatNumber(value, { prefix, postfix, roundingMode }) : undefined}
    >
      {value ? formattedValue || defaultValue : ''}
    </Wrapper>
  );
};

const Ellipsis = styled.span.attrs({
  children: '…',
})`
  font-size: 50%;
`;

const Wrapper = styled.span`
  white-space: nowrap;
`;

export default DecimalValue;
