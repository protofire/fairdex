import { ActionCreator, AnyAction, Reducer } from 'redux';

import { getCurrentAccount } from '../web3';

export * from './selectors';

// Actions
const SET_BUY_ORDERS = 'SET_BUY_ORDERS';
const ADD_BUY_ORDER = 'ADD_BUY_ORDER';

const reducer: Reducer<BuyOrdersState> = (state = {}, action) => {
  switch (action.type) {
    case SET_BUY_ORDERS:
      return {
        ...state,
        buyOrders: action.payload,
      };

    case ADD_BUY_ORDER:
      const { sellToken, buyToken, auctionIndex } = action.payload;
      const { buyOrders = [] } = state;

      const orderExist =
        buyOrders &&
        buyOrders.find(
          order =>
            order.sellToken === sellToken &&
            order.buyToken === buyToken &&
            order.auctionIndex === auctionIndex,
        );

      const nextBuyOrder = !orderExist ? [...buyOrders, action.payload] : [...buyOrders];

      return {
        ...state,
        buyOrders: nextBuyOrder,
      };

    default:
      return state;
  }
};

export const loadBidHistory = () => {
  return async (dispatch: any, getState: () => AppState) => {
    const account = getCurrentAccount(getState());

    if (account) {
      const buyOrders = await dx.getBuyOrders(account);

      dispatch(setBuyOrder(buyOrders || []));
    }
  };
};

const setBuyOrder: ActionCreator<AnyAction> = (buyOrders: BuyOrder[]) => {
  return {
    type: SET_BUY_ORDERS,
    payload: Array.from(buyOrders),
  };
};

const addBuyOrder: ActionCreator<AnyAction> = (buyOrder: BuyOrder) => {
  return {
    type: ADD_BUY_ORDER,
    payload: buyOrder,
  };
};

export default reducer;
