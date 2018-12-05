import { ActionCreator, AnyAction, Dispatch, Reducer } from 'redux';

const SET_AVAILABLE_TOKENS = 'wallet/SET_AVAILABLE_TOKENS';

const reducer: Reducer<TokensState> = (state = {}, action) => {
  switch (action.type) {
    case SET_AVAILABLE_TOKENS:
      return action.payload;

    default:
      return state;
  }
};

export function fetchAvailableTokens() {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    const { wallet } = getState();
    const { network } = wallet;

    try {
      const { default: tokens } = await import(`./data/${network}.json`);

      dispatch(setAvailableTokens(tokens));
    } catch (err) {
      // TODO: Handle error
    }
  };
}

const setAvailableTokens: ActionCreator<AnyAction> = (tokens: Token[]) => {
  return {
    type: SET_AVAILABLE_TOKENS,
    payload: tokens.reduce((r, token) => ({ ...r, [token.address]: token }), {})
  };
};

export default reducer;
