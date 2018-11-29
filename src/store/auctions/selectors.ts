import { createSelector } from 'reselect';

export const getSellTokens = createSelector(
  (state: AppState) => state.auctions.list,
  (list: Auction[]) => buildTokens(list, 'sellToken')
);

export const getBuyTokens = createSelector(
  (state: AppState) => state.auctions.list,
  (list: Auction[]) => buildTokens(list, 'buyToken')
);

export const getRunningAuctions = createSelector(
  (state: AppState) => state.auctions.list,
  (list: Auction[]) => filterTokens(list, 'running')
);

export const getEndedAuctions = createSelector(
  (state: AppState) => state.auctions.list,
  (list: Auction[]) => filterTokens(list, 'ended')
);

export const getScheduledAuctions = createSelector(
  (state: AppState) => state.auctions.list,
  (list: Auction[]) => filterTokens(list, 'scheduled')
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

function filterTokens(list: Auction[], state: AuctionState) {
  return list.filter(item => item.state === state);
}
