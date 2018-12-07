import { ActionCreator, AnyAction, Reducer } from 'redux';

import { fetchRunningAuctions } from '../auctions';
import { getNetworkType } from '../wallet';

export * from './selectors';

// Actions
const SET_AVAILABLE_TOKENS = 'SET_AVAILABLE_TOKENS';

const reducer: Reducer<TokensState> = (state = {}, action) => {
  switch (action.type) {
    case SET_AVAILABLE_TOKENS:
      return {
        ...state,
        tokens: action.payload
      };

    default:
      return state;
  }
};

export function fetchAvailableTokens() {
  return async (dispatch: any, getState: () => AppState) => {
    const network = getNetworkType(getState());

    try {
      const { default: tokens } = await import(`./networks/${network}.json`);

      dispatch(setAvailableTokens(tokens));

      // Load running auctions
      dispatch(fetchRunningAuctions());
    } catch (err) {
      // TODO: Handle error
    }
  };
}

const setAvailableTokens: ActionCreator<AnyAction> = (tokens: Token[]) => {
  return {
    type: SET_AVAILABLE_TOKENS,
    payload: tokens.reduce((all: object, t: Token) => ({ ...all, [t.address]: t }), {})
  };
};

export default reducer;
