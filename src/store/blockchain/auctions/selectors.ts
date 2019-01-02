import { createSelector } from 'reselect';

import { getAllTokens } from '../tokens';
import { ZERO } from '../../../contracts/utils';
import { getDxBalance, getWalletBalance } from '../../../contracts/utils/tokens';
import { getSellVolumeInEth } from '../../../contracts/utils/auctions';

const getAllAuctions = (state: AppState) => state.blockchain.auctions || [];

export const getSellTokens = createSelector(
  getAllAuctions,
  (auctions: Auction[]) => buildTokens(auctions, 'sellToken'),
);

export const getBuyTokens = createSelector(
  getAllAuctions,
  (auctions: Auction[]) => buildTokens(auctions, 'buyToken'),
);

export const getFilteredAuctions = createSelector(
  getAllAuctions,
  (state: AppState) => state.filters,
  getAllTokens,
  filterAuctions,
);

export const getRunningAuctions = createSelector(
  getFilteredAuctions,
  (auctions: Auction[]) => auctions.filter(auction => auction.state === 'running'),
);

export const getEndedAuctions = createSelector(
  getFilteredAuctions,
  (auctions: Auction[]) => auctions.filter(auction => auction.state === 'ended'),
);

export const getScheduledAuctions = createSelector(
  getFilteredAuctions,
  (auctions: Auction[]) => auctions.filter(auction => auction.state === 'scheduled'),
);

export const getFilteredMyTokensAuctions = createSelector(
  getAllAuctions,
  (state: AppState) => state.blockchain.tokens,
  filterMyTokensAuctions,
);

export const getFilteredClaimableAuctions = createSelector(
  getAllAuctions,
  filterClaimableAuctions,
);

function buildTokens(list: Auction[], type: 'sellToken' | 'buyToken') {
  const output = list.reduce<Record<string, TokenInfo>>((tokenMap, value) => {
    const id = value[type];

    if (!tokenMap[id]) {
      tokenMap[id] = { id, name: id, count: 0 };
    }

    tokenMap[id].count++;

    return tokenMap;
  }, {});

  const outputList = Object.values(output);

  outputList.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else if (a.id < b.id) {
      return -1;
    }
    return 0;
  });

  return outputList;
}

function filterAuctions(list: Auction[], filters: FiltersState, tokens: Map<Address, Token>) {
  let out = Array.from(list);

  const sortMap: { [filter in SortField]: (a: Auction, b: Auction) => boolean } = {
    'buy-token': (a: Auction, b: Auction) => a.buyToken > b.buyToken,
    'sell-volume': (a: Auction, b: Auction) =>
      getSellVolumeInEth(a, tokens).gt(getSellVolumeInEth(b, tokens)),
    'start-time': (a: Auction, b: Auction) => a.auctionStart > b.auctionStart,
  };

  const sortFunc = sortMap[filters.sortBy] as (a: Auction, b: Auction) => boolean;

  if (sortFunc) {
    out.sort((a: Auction, b: Auction) => {
      if (sortFunc(a, b)) {
        return filters.sortDir === 'asc' ? -1 : 1;
      } else if (sortFunc(b, a)) {
        return filters.sortDir === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  if (filters.claimableAuctions) {
    out = filterClaimableAuctions(out);
  }

  if (filters.onlyMyTokens) {
    out = filterMyTokensAuctions(out, tokens);
  }

  if (filters.sellTokens.length > 0) {
    out = out.filter(item => filters.sellTokens.includes(item.sellToken));
  }

  if (filters.buyTokens.length > 0) {
    out = out.filter(item => filters.buyTokens.includes(item.buyToken));
  }

  return out;
}

function filterMyTokensAuctions(list: Auction[], tokens = new Map<Address, Token>()) {
  return list.filter(item => {
    const myTokenAddresses = Array.from(tokens.keys()).filter(addr => {
      const dxBalance = getDxBalance(tokens.get(addr));
      const walletBalance = getWalletBalance(tokens.get(addr));

      return dxBalance.gt(ZERO) || walletBalance.gt(ZERO);
    });

    return myTokenAddresses.includes(item.buyTokenAddress);
  });
}

function filterClaimableAuctions(list: Auction[]) {
  return list.filter(item => item.buyerBalance && item.buyerBalance.gt(ZERO));
}
