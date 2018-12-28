import { ActionCreator, AnyAction, Reducer } from 'redux';

export * from './selectors';

// Actions
const INIT_BUY_ORDER = 'INIT_BUY_ORDER';
const ADD_BUY_ORDER = 'ADD_BUY_ORDER';

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_BUY_ORDER:
      return {
        ...state,
        buyOrders: [...action.payload],
      };
    case ADD_BUY_ORDER:
      const { buyOrders } = state;
      const { sellToken, buyToken, auctionIndex } = action.payload;
      const orderExist =
        buyOrders &&
        buyOrders.find(order => {
          return (
            order.sellToken === sellToken &&
            order.buyToken === buyToken &&
            order.auctionIndex === auctionIndex
          );
        });

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
    type: INIT_BUY_ORDER,
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
