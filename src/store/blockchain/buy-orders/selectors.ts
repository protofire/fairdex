import { createSelector } from 'reselect';

export const getAllBuyOrders = (state: AppState) => state.blockchain.buyOrders;

export const getBidsCount = createSelector(
  getAllBuyOrders,
  (buyOrders?: BuyOrder[]) => (buyOrders ? buyOrders.length : 0),
);
