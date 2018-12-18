import { ActionCreator, AnyAction, Reducer } from 'redux';

import TokenContract from '../../../contracts/TokenContract';
import { Decimal } from '../../../contracts/utils';
import { periodicAction } from '../../utils';
import { loadRunningAuctions } from '../auctions';
import { getNetworkType } from '../wallet';

export * from './selectors';

// Actions
const SET_AVAILABLE_TOKENS = 'SET_AVAILABLE_TOKENS';
const SET_FEE_RATIO = 'SET_FEE_RATIO';
const SET_TOKEN_BALANCES = 'SET_TOKEN_BALANCES';

const cache = new Map<Address, TokenContract>();

const reducer: Reducer<TokensState> = (state = {}, action) => {
  switch (action.type) {
    case SET_AVAILABLE_TOKENS:
      return {
        ...state,
        tokens: action.payload,
      };

    case SET_FEE_RATIO:
      return {
        ...state,
        feeRatio: action.payload,
      };

    case SET_TOKEN_BALANCES:
      return {
        ...state,
        tokens: Object.values(state.tokens || {}).reduce((all, token) => {
          token.balance = action.payload.get(token.address);

          return { ...all, [token.address]: token };
        }),
      };

    default:
      return state;
  }
};

export function loadAvailableTokens() {
  return periodicAction({
    name: 'loadAvailableTokens',
    interval: 15_000, // check for tokens every 15 seconds

    async task(dispatch, getState) {
      const network = getNetworkType(getState());

      try {
        const { default: tokens } = await import(`./networks/${network}.json`);

        dispatch(setAvailableTokens(tokens));

        // Load running auctions
        dispatch(loadRunningAuctions());

        // Load token balances
        dispatch(updateTokenBalances());
      } catch (err) {
        // TODO: Handle error
      }
    },
  });
}

export function updateFeeRatio() {
  return periodicAction({
    name: 'updateFeeRatio',
    interval: 60_000 * 2, // update fee ratio every 2 minutes

    async task(dispatch, getState) {
      const { dx } = window;
      const { blockchain } = getState();

      if (blockchain.currentAccount) {
        const ratio = await dx.getFeeRatio(blockchain.currentAccount);

        if (ratio) {
          dispatch(setFeeRatio(ratio));
        }
      }
    },
  });
}

export function updateTokenBalances() {
  return async (dispatch: any, getState: () => AppState) => {
    const state = getState();

    if (state.blockchain.currentAccount) {
      const { currentAccount, tokens = {} } = state.blockchain;

      const tokensWithBalances = await Promise.all(
        Object.values(tokens).map(async token => {
          const contract = getTokenContract(token);

          if (contract) {
            const balance = await contract.getTokenBalance(currentAccount, token);

            return [token.address, balance];
          }
        }),
      );

      dispatch(setTokenBalances(tokensWithBalances));
    }
  };
}

function getTokenContract(token: Token) {
  const contract = cache.get(token.address) || new TokenContract(token);

  if (contract != null && !cache.has(token.address)) {
    cache.set(token.address, contract);
  }

  return contract;
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

const setFeeRatio: ActionCreator<AnyAction> = (ratio: BigNumber) => {
  return {
    type: SET_FEE_RATIO,
    payload: ratio,
  };
};

const setTokenBalances: ActionCreator<AnyAction> = (balances: Array<[Address, Decimal]>) => {
  return {
    type: SET_TOKEN_BALANCES,
    payload: new Map(balances),
  };
};

export default reducer;
