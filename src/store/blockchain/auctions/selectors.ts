import { createSelector } from 'reselect';

import { ZERO } from '../../../contracts/utils';
import { getSellVolumeInEth } from '../../../contracts/utils/auctions';
import { getDxBalance, getWalletBalance } from '../../../contracts/utils/tokens';
import { getAllTokens } from '../tokens';

export const getAllAuctions = (state: AppState) => state.blockchain.auctions || [];

export const getAuctionFilters = (state: AppState) => state.filters;

export const getSellTokens = createSelector(
  getAllAuctions,
  (auctions: Auction[]) => buildTokens(auctions, 'sellToken'),
);

export const getBuyTokens = createSelector(
  getAllAuctions,
  (auctions: Auction[]) => buildTokens(auctions, 'buyToken'),
);

const selectRunningAuctions = createSelector(
  getAllAuctions,
  auctions => auctions.filter(auction => auction.state === 'running'),
);

export const getRunningAuctions = createSelector(
  selectRunningAuctions,
  getAuctionFilters,
  getAllTokens,
  filterAuctions,
);

const selectScheduledAuctions = createSelector(
  getAllAuctions,
  auctions => auctions.filter(auction => auction.state === 'scheduled'),
);

export const getScheduledAuctions = createSelector(
  selectScheduledAuctions,
  getAuctionFilters,
  getAllTokens,
  filterAuctions,
);

const selectEndedAuctions = createSelector(
  getAllAuctions,
  auctions => auctions.filter(auction => auction.state === 'ended'),
);

export const getEndedAuctions = createSelector(
  selectEndedAuctions,
  getAuctionFilters,
  getAllTokens,
  filterAuctions,
);

export const getFilteredMyTokensAuctions = createSelector(
  getAllAuctions,
  getAllTokens,
  filterMyTokensAuctions,
);

export const getFilteredClaimableAuctions = createSelector(
  getAllAuctions,
  filterClaimableAuctions,
);

export const getClaimableAuctionsCount = createSelector(
  getFilteredClaimableAuctions,
  auctions => auctions.length || 0,
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

export function filterAuctions(list: Auction[], filters: FiltersState, tokens: Map<Address, Token>) {
  let out = Array.from(list);

  if (list.length) {
    // Filtering
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

    // Sorting
    const sortMap: { [filter in AuctionSortField]: (a: Auction, b: Auction) => number } = {
      'bid-token': (a: Auction, b: Auction) => {
        if (a.buyToken === b.buyToken) {
          return a.sellToken.localeCompare(b.sellToken);
        }

        return a.buyToken.localeCompare(b.buyToken);
      },
      'sell-volume': (a: Auction, b: Auction) => {
        const volumeA = getSellVolumeInEth(a, tokens);
        const volumeB = getSellVolumeInEth(b, tokens);

        if (!volumeA.eq(volumeB)) {
          return volumeA.comparedTo(volumeB);
        }

        return sortMap['bid-token'](a, b);
      },
      'end-time': (a: Auction, b: Auction) => {
        if (a.state === 'running' && b.state === 'running') {
          if (a.auctionStart && a.auctionStart === b.auctionStart) {
            return sortMap['bid-token'](a, b);
          }

          return a.auctionStart - b.auctionStart;
        } else if (a.state === 'scheduled' && b.state === 'scheduled') {
          if (a.auctionStart && a.auctionStart === b.auctionStart) {
            return sortMap['bid-token'](a, b);
          }

          return a.auctionStart - b.auctionStart;
        } else if (a.state === 'ended' && b.state === 'ended') {
          if (a.auctionEnd && a.auctionEnd === b.auctionEnd) {
            return sortMap['bid-token'](a, b);
          }

          return a.auctionEnd - b.auctionEnd;
        }

        return 0;
      },
    };

    const sortFunc = sortMap[filters.auctionSortBy];

    if (sortFunc) {
      out.sort((a: Auction, b: Auction) =>
        filters.auctionSortDir === 'asc' ? sortFunc(a, b) : sortFunc(b, a),
      );
    }
  }

  return out;
}

function filterClaimableAuctions(list: Auction[]) {
  return list.filter(item => item.unclaimedFunds && item.unclaimedFunds.gt(ZERO));
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
