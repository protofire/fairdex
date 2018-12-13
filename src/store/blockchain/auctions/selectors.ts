import { createSelector } from 'reselect';

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
  (state: AppState) => state.blockchain,
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

function filterAuctions(list: Auction[], filters: FiltersState, blockchain: BlockchainState) {
  let out = Array.from(list);

  const sortMap: { [filter in SortField]: keyof Auction } = {
    'buy-token': 'buyToken',
    'sell-volume': 'sellVolume',
    'start-time': 'auctionStart',
  };

  const sortField = sortMap[filters.sortBy] as keyof Auction;

  if (sortField) {
    out.sort((a: Auction, b: Auction) => {
      const field1 = a[sortField] || 0;
      const field2 = b[sortField] || 0;

      if (field1 > field2) {
        return filters.sortDir === 'asc' ? -1 : 1;
      } else if (field1 < field2) {
        return filters.sortDir === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  if (filters.onlyMyAuctions) {
    // out = out.filter(item => item.sellTokenAddress === blockchain.wallet.currentAccount);
  }

  if (filters.onlyMyTokens) {
    out = out.filter(item => {
      const tokens = blockchain.tokens || {};
      const myTokenAddresses = Object.keys(tokens).filter(addr => {
        return tokens[addr].balance > 0;
      });
      return myTokenAddresses.includes(item.sellTokenAddress);
    });
  }

  if (filters.sellTokens.length > 0) {
    out = out.filter(item => filters.sellTokens.includes(item.sellToken));
  }

  if (filters.buyTokens.length > 0) {
    out = out.filter(item => filters.buyTokens.includes(item.buyToken));
  }

  return out;
}
