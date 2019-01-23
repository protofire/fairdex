import React, { HTMLAttributes } from 'react';

import styled from 'styled-components';
import { Decimal, DecimalFormat, formatNumber, toBigNumber } from '../../contracts/utils';

interface Props extends DecimalFormat, HTMLAttributes<HTMLSpanElement> {
  value?: Decimal;
  defaultValue?: string;
  hideTitle?: boolean;
}

const DecimalValue = ({ value, defaultValue, decimals, hideTitle, prefix, postfix, ...props }: Props) => {
  let formatedValue = <>{value && formatNumber(value, { decimals, prefix, postfix })}</>;
  if (value && toBigNumber(value).gt(0) && formatNumber(value, { decimals }) === '0') {
    formatedValue = (
      <>
        {`${prefix ? prefix + ' ' : ''}0.0`}
        <Elipsis />
        {`${postfix ? ' ' + postfix : ''}`}
      </>
    );
  }

  return (
    <Wrapper {...props} title={!hideTitle && value ? formatNumber(value, { prefix, postfix }) : undefined}>
      {value ? formatedValue || defaultValue : ''}
    </Wrapper>
  );
};

const Elipsis = styled.span.attrs({
  children: '…',
})`
  font-size: 50%;
`;

const Wrapper = styled.span`
  white-space: nowrap;
`;

export default DecimalValue;
