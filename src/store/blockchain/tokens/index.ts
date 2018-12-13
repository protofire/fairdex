import { ActionCreator, AnyAction, Reducer } from 'redux';

import TokenContract from '../../../contracts/TokenContract';
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
    const ownerAddress = getState().blockchain.currentAccount as string;
    const tokens = getState().blockchain.tokens || {};
    const balanceGetters = Object.keys(tokens).map(tokenAddress => {
      return (async () => {
        const token = tokens[tokenAddress];
        const contract = new TokenContract(token);
        const balance = await contract.getTokenBalance(ownerAddress);
        return { ...token, balance };
      })();
    });
    const tokensWithBalances = await Promise.all(balanceGetters);
    dispatch(setAvailableTokens(tokensWithBalances));
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
