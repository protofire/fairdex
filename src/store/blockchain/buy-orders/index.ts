import { ActionCreator, AnyAction, Reducer } from 'redux';

export * from './selectors';

// Actions
const INIT_BUY_ORDERS = 'INIT_BUY_ORDERS';
const ADD_BUY_ORDER = 'ADD_BUY_ORDER';

const reducer: Reducer<BuyOrdersState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_BUY_ORDERS:
      return {
        ...state,
        buyOrders: [...action.payload],
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

export const initBuyOrder: ActionCreator<AnyAction> = (buyOrders: BuyOrder[]) => {
  return {
    type: INIT_BUY_ORDERS,
    payload: buyOrders,
  };
};

export const addBuyOrder: ActionCreator<AnyAction> = (buyOrder: BuyOrder) => {
  return {
    type: ADD_BUY_ORDER,
    payload: buyOrder,
  };
};

export default reducer;
