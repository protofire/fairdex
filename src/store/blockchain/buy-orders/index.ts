import { ActionCreator, AnyAction, Reducer } from 'redux';

const INIT_BUY_ORDER = 'INIT_BUY_ORDER';
const ADD_BUY_ORDER = 'ADD_BUY_ORDER';

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_BUY_ORDER:
      return {
        ...state,
        buyOrders: [],
      };
    case ADD_BUY_ORDER:
      return {
        ...state,
        buyOrders: [...state.buyOrders, action.payload],
      };

    default:
      return state;
  }
};

export const initBuyOrder: ActionCreator<AnyAction> = () => {
  return {
    type: INIT_BUY_ORDER,
  };
};

export const addBuyOrder: ActionCreator<AnyAction> = (buyOrder: BuyOrder) => {
  return {
    type: ADD_BUY_ORDER,
    payload: buyOrder,
  };
};

export default reducer;
