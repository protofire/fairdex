import { createSelector } from 'reselect';

import { ZERO } from '../../../contracts/utils';
import { getDxBalance, getTotalBalance, getWalletBalance } from '../../../contracts/utils/tokens';
import { getFrt } from '../frt';

export const getToken = (state: AppState, address: Address) => state.blockchain.tokens.get(address);

export const getAllTokens = (state: AppState) => state.blockchain.tokens || new Map();

export const getCurrentFeeRatio = (state: AppState) => state.blockchain.feeRatio && state.blockchain.feeRatio;

export const getFeePercentage = createSelector(
  getCurrentFeeRatio,
  (feeRatio: BigNumber) => (tate.blockchain.feeRatio ? state.blockchain.feeRatio.times(100) : ZERO),
);

export const getTokensWithBalance = createSelector(
  getAllTokens,
  getFrt,
  (tokens: Token[], frt: Token) => {
    const tokensWithBalance = Array.from(tokens).filter(
      ([_, token]): [Address, Token] => getDxBalance(token).gt(0) || getWalletBalance(token).gt(0),
    );

    if (frt && getTotalBalance(frt).gt(0)) {
      tokensWithBalance.push(frt);
    }

    return tokensWithBalance;
  },
);

export const getTopBalances = createSelector(
  getAllTokens,
  (tokens: Token[]) => {
    const topBalances = Array.from(tokens)
      .map(
        ([_, token]): [Address, Token] => ({
          ...token,
          totalBalance: getTotalBalance(token),
        }),
      )
      .sort((a, b) => {
        const aEthBalance = a.totalBalance.times(a.priceEth);
        const bEthBalance = b.totalBalance.times(b.priceEth);
        return bEthBalance.minus(aEthBalance);
      });

    return topBalances;
  },
);
