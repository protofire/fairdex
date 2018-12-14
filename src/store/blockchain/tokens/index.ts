import { ActionCreator, AnyAction, Reducer } from 'redux';

import TokenContract from '../../../contracts/TokenContract';
import { fetchRunningAuctions } from '../auctions';
import { getNetworkType } from '../wallet';

export * from './selectors';

// Actions
const SET_AVAILABLE_TOKENS = 'SET_AVAILABLE_TOKENS';
// TODO: const SET_TOKEN_BALANCES = 'SET_TOKEN_BALANCES';

const reducer: Reducer<TokensState> = (state = {}, action) => {
  switch (action.type) {
    case SET_AVAILABLE_TOKENS:
      return {
        ...state,
        tokens: action.payload,
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

      // Fetch token balances
      dispatch(updateTokenBalances());
    } catch (err) {
      // TODO: Handle error
    }
  };
}

export function updateTokenBalances() {
  return async (dispatch: any, getState: () => AppState) => {
    const state = getState();

    if (state.blockchain.currentAccount) {
      const { currentAccount, tokens = {} } = state.blockchain;

      const tokensWithBalances = await Promise.all(
        Object.values(tokens).map(async token => {
          // TODO: Cache contract instance
          const contract = new TokenContract(token);
          const balance = await contract.getTokenBalance(currentAccount);

          return { ...token, balance };
        }),
      );

      dispatch(setAvailableTokens(tokensWithBalances));
    }
  };
}

const setAvailableTokens: ActionCreator<AnyAction> = (tokens: Token[]) => {
  return {
    type: SET_AVAILABLE_TOKENS,
    payload: tokens.reduce(
      (all: object, t: Token) => (t.symbol.startsWith('test') ? all : { ...all, [t.address]: t }),
      {},
    ),
  };
};

export default reducer;
