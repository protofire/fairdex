import React from 'react';

import { DecimalValue } from '../../../components/formatters';
import Spinner from '../../../components/Spinner';
import * as utils from '../../../contracts/utils';

interface TokenBalanceProps {
  token?: Token;
  balance?: number | BigNumber;
  decimals?: number;
  label?: string;
  description?: string;
  loading?: boolean;
}

const TokenBalance = ({ token, balance, label, description, loading, decimals = 3 }: TokenBalanceProps) =>
  token != null && !loading ? (
    <>
      <DecimalValue
        value={balance || utils.token.getTotalBalance(token) || 0}
        decimals={decimals}
        data-testid={`${token.symbol}-balance`}
      />
      <small title={description || token.name} data-testid={`${token.symbol}-symbol`}>
        {label || token.symbol}
      </small>
    </>
  ) : (
    <Spinner size='small' inline />
  );

export default TokenBalance;
