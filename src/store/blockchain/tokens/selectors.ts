import { createSelector } from 'reselect';

import { ZERO } from '../../../contracts/utils';
import { getTotalBalance } from '../../../contracts/utils/tokens';
import { getFrt } from '../frt';

export const getToken = (state: AppState, address: Address) => state.blockchain.tokens.get(address);

export const getAllTokens = (state: AppState) => state.blockchain.tokens || new Map();

export const getLiqContribRatio = (state: AppState) =>
  state.blockchain.feeRatio ? state.blockchain.feeRatio : ZERO;

export const getLiqContribPercentage = createSelector(
  getLiqContribRatio,
  (feeRatio: BigNumber) => feeRatio.times(100),
);

export const getTokensWithBalance = createSelector(
  getAllTokens,
  getFrt,
  (tokens, frt) => {
    const tokensWithBalance = Array.from(tokens)
      .map(([_, token]: [Address, Token]) => token)
      .filter((token: Token) => getTotalBalance(token).gt(0));

    if (frt && getTotalBalance(frt).gt(0)) {
      tokensWithBalance.push(frt);
    }

    return tokensWithBalance;
  },
);

export const getTopBalances = createSelector(
  getAllTokens,
  tokens => {
    return Array.from(tokens)
      .map(
        ([_, token]: [Address, Token]): TokenWithBalance => ({
          ...token,
          totalBalance: getTotalBalance(token),
        }),
      )
      .sort((a, b) => {
        const aEthBalance = a.totalBalance.times(a.priceEth || ZERO);
        const bEthBalance = b.totalBalance.times(b.priceEth || ZERO);

        return bEthBalance.minus(aEthBalance).toNumber();
      });
  },
);
