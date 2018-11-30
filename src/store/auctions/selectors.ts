import { createSelector } from 'reselect';

export const getSellTokens = createSelector(
  (state: AppState) => state.auctions.list,
  (list: Auction[]) => buildTokens(list, 'sellToken')
);

export const getBuyTokens = createSelector(
  (state: AppState) => state.auctions.list,
  (list: Auction[]) => buildTokens(list, 'buyToken')
);

export const getFilteredAuctions = createSelector(
  (state: AppState) => state.auctions.list,
  (state: AppState) => state.filters,
  (state: AppState) => state.wallet,
  filterAuctions
);

export const getRunningAuctions = createSelector(
  getFilteredAuctions,
  list => list.filter(item => item.state === 'running')
);

export const getEndedAuctions = createSelector(
  getFilteredAuctions,
  list => list.filter(item => item.state === 'ended')
);

export const getScheduledAuctions = createSelector(
  getFilteredAuctions,
  list => list.filter(item => item.state === 'scheduled')
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

function filterAuctions(list: Auction[], filters: FiltersState, wallet: WalletState) {
  let out = Array.from(list);
  const sortMap = {
    token: 'buyToken',
    'sell-volume': 'sellVolume',
    'end-time': 'auctionEnd'
  };
  const sortField = sortMap[filters.sortBy] as keyof Auction;
  if (sortField) {
    out.sort((a, b) => {
      if (a[sortField] > b[sortField]) {
        return filters.sortDir === 'asc' ? -1 : 1;
      } else if (a[sortField] < b[sortField]) {
        return filters.sortDir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  if (filters.onlyMyAuctions) {
    out = out.filter(item => item.sellTokenAddress === wallet.accountAddress);
  }
  if (filters.onlyMyTokens) {
    // TODO
  }
  if (filters.sellTokens.length > 0) {
    out = out.filter(item => filters.sellTokens.includes(item.sellToken));
  }
  if (filters.buyTokens.length > 0) {
    out = out.filter(item => filters.buyTokens.includes(item.sellToken));
  }

  return out;
}
