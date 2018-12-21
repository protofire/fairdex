import { Action, ActionCreator, AnyAction, Reducer } from 'redux';

import { getTokenContract } from '../../../contracts';
import { Decimal } from '../../../contracts/utils';
import { periodicAction } from '../../utils';
import { loadAuctions } from '../auctions';
import { getNetworkType } from '../wallet';

// Actions
const SET_AVAILABLE_TOKENS = 'SET_AVAILABLE_TOKENS';
const SET_FEE_RATIO = 'SET_FEE_RATIO';
const SET_TOKEN_BALANCES = 'SET_TOKEN_BALANCES';

const initialState: TokensState = {
  tokens: new Map<Address, Token>(),
};

const reducer: Reducer<TokensState> = (state = initialState, action) => {
  switch (action.type) {
    case SET_AVAILABLE_TOKENS:
      return {
        ...state,
        tokens: new Map<Address, Token>(
          action.payload.reduce((all: Array<[Address, Token]>, token: Token) => {
            if (!token.symbol.startsWith('test')) {
              all.push([token.address, token]);
            }

            return all;
          }, []),
        ),
      };

    case SET_FEE_RATIO:
      return {
        ...state,
        feeRatio: action.payload,
      };

    case SET_TOKEN_BALANCES:
      return {
        ...state,
        tokens: new Map<Address, Token>(
          Array.from(state.tokens).map(
            ([_, token]): [Address, Token] => {
              token.balance = action.payload.get(token.address);

              return [token.address, token];
            },
          ),
        ),
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

        // Load auctions
        dispatch(loadAuctions());

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
    const { blockchain } = getState();

    const tokens = blockchain.tokens;
    const accountAddress = blockchain.currentAccount;

    if (accountAddress && tokens.size > 0) {
      const tokensWithBalances = await Promise.all(
        Array.from(tokens).map(async ([_, token]) => {
          const tokenContract = getTokenContract(token);

          const [contractBalance, walletBalance] = await Promise.all([
            dx.getBalance(token, accountAddress),
            tokenContract.getBalance(accountAddress),
          ]);

          return [token.address, [contractBalance, walletBalance]];
        }),
      );

      dispatch(setTokenBalances(tokensWithBalances));
    }
  };
}

const setAvailableTokens: ActionCreator<AnyAction> = (tokens: Token[]) => {
  return {
    type: SET_AVAILABLE_TOKENS,
    payload: tokens,
  };
};

const setFeeRatio: ActionCreator<AnyAction> = (ratio: BigNumber) => {
  return {
    type: SET_FEE_RATIO,
    payload: ratio,
  };
};

const setTokenBalances: ActionCreator<Action> = (balances: Array<[Address, [Decimal, Decimal]]>) => {
  return {
    type: SET_TOKEN_BALANCES,
    payload: new Map(balances),
  };
};

export default reducer;
