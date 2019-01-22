import { Action, ActionCreator, AnyAction, Reducer } from 'redux';

import { getTokenContract } from '../../../contracts';
import { Decimal } from '../../../contracts/utils';
import { periodicAction } from '../../utils';
import { loadAuctions } from '../auctions';
import { getCurrentAccount, getNetworkType } from '../wallet';

export * from './selectors';

// Actions
const SET_TOKENS = 'SET_TOKENS';
const SET_FEE_RATIO = 'SET_FEE_RATIO';
const SET_TOKEN_ALLOWANCE = 'SET_TOKEN_ALLOWANCE';

const initialState: TokensState = {
  tokens: new Map<Address, Token>(),
};

const reducer: Reducer<TokensState> = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKENS:
      return {
        ...state,
        tokens: new Map<Address, Token>(action.payload.map((token: Token) => [token.address, token])),
      };

    case SET_FEE_RATIO:
      return {
        ...state,
        feeRatio: action.payload,
      };

    case SET_TOKEN_ALLOWANCE:
      return {
        ...state,
        tokens: new Map<Address, Token>(
          Array.from(state.tokens).map(
            ([_, token]): [Address, Token] => {
              const newToken = { ...token };

              if (token.address === action.payload.address) {
                newToken.allowance = action.payload.allowance;
              }

              return [newToken.address, newToken];
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
    interval: 2 * 60_000, // check for tokens every 2 minutes

    async task(dispatch, getState) {
      const network = getNetworkType(getState());

      try {
        const { default: tokens } = await import(`./networks/${network}.json`);

        // Load tokens
        dispatch(loadTokens());

        // Load auctions
        dispatch(loadAuctions());
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
          dispatch(setFeeRatio(ratio.value));
        }
      }
    },
  });
}

export function loadTokens() {
  return async (dispatch: any, getState: () => AppState) => {
    const { blockchain } = getState();

    const tokens: Token[] = await getAvailableTokens(getNetworkType(getState()));
    const accountAddress = blockchain.currentAccount;

    if (accountAddress && tokens.length > 0) {
      const tokensWithData = await Promise.all(
        Array.from(tokens).map(async token => {
          const tokenContract = getTokenContract(token);

          const [contractBalance, walletBalance, priceEth, allowance] = await Promise.all([
            dx.getBalance(token, accountAddress),
            tokenContract.getBalance(accountAddress),
            dx.getPriceOfTokenInLastAuction(token),
            tokenContract.getAllowance(accountAddress, dx.address),
          ]);

          token.balance = [contractBalance, walletBalance];
          token.priceEth = priceEth.value;
          token.allowance = allowance;

          return token;
        }),
      );

      dispatch(setTokens(tokensWithData));
    }
  };
}

const setTokens: ActionCreator<AnyAction> = (tokens: Token[]) => {
  return {
    type: SET_TOKENS,
    payload: tokens,
  };
};

const setFeeRatio: ActionCreator<AnyAction> = (ratio: BigNumber) => {
  return {
    type: SET_FEE_RATIO,
    payload: ratio,
  };
};

const setTokenAllowance: ActionCreator<Action> = (address: Address, allowance: BigNumber) => {
  return {
    type: SET_TOKEN_ALLOWANCE,
    payload: { address, allowance },
  };
};

export const updateTokenAllowance = (token: Token) => {
  return async (dispatch: any, getState: () => AppState) => {
    const currentAccount = getCurrentAccount(getState());
    const tokenContract = getTokenContract(token);

    const allowance = await tokenContract.getAllowance(currentAccount, window.dx.address);

    dispatch(setTokenAllowance(token.address, allowance));
  };
};

const getAvailableTokens = async (network: Network | null) => {
  if (!network) {
    return [];
  }

  const { default: tokens } = await import(`./networks/${network}.json`);

  return tokens.filter((token: Token) => !token.symbol.startsWith('test'));
};

export default reducer;
