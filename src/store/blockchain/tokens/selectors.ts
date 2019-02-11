import { createSelector } from 'reselect';

import { ZERO } from '../../../contracts/utils';
import { getDxBalance, getTotalBalance, getWalletBalance } from '../../../contracts/utils/tokens';
import { getFrt } from '../frt';

export const getToken = (state: AppState, address: Address) => state.blockchain.tokens.get(address);

export const getOwlAddress = (state: AppState) => state.blockchain.owlAddress;

export const getAllTokens = (state: AppState) => state.blockchain.tokens || new Map();

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

export const getOwl = createSelector(
  getAllTokens,
  getOwlAddress,
  (tokens, owlAddress) => {
    return Array.from(tokens)
      .map(([_, token]: [Address, Token]) => token)
      .find((token: Token) => token.address === owlAddress);
  },
);

export const getFilteredTokens = createSelector(
  getAllTokens,
  (state: AppState) => state.filters,
  filterTokens,
);

const sortMap: { [filter in TokenSortField]: (a: Token, b: Token) => boolean } = {
  'token-name': (a: Token, b: Token) => a.symbol > b.symbol,
  'w-balance': (a: Token, b: Token) => getWalletBalance(a).gt(getWalletBalance(b)),
  'dx-balance': (a: Token, b: Token) => getDxBalance(a).gt(getDxBalance(b)),
  'total-balance': (a: Token, b: Token) => getTotalBalance(a).gt(getTotalBalance(b)),
};

function filterTokens(tokens: Map<Address, Token>, filters: FiltersState) {
  let out = Array.from(tokens).map(([_, token]: [Address, Token]) => token);

  if (filters.hideZeroBalance) {
    out = out.filter((token: Token) => getTotalBalance(token).gt(0));
  }

  if (filters.tokenSearchQuery) {
    out = out.filter((token: Token) =>
      token.symbol.toLowerCase().startsWith(filters.tokenSearchQuery.toLowerCase()),
    );
  }

  const sortFunc = sortMap[filters.tokenSortBy] as (a: Token, b: Token) => boolean;

  if (sortFunc) {
    out.sort((a: Token, b: Token) => {
      if (sortFunc(a, b)) {
        return filters.tokenSortDir === 'asc' ? 1 : -1;
      } else if (sortFunc(b, a)) {
        return filters.tokenSortDir === 'asc' ? -1 : 1;
      }

      return 0;
    });
  }

  return out;
}
