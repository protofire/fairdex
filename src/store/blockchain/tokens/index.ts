import { Action, ActionCreator, AnyAction, Reducer } from 'redux';

import { getErc20Contract } from '../../../contracts';
import { loadAuctions } from '../auctions';
import { getCurrentAccount, getNetworkType } from '../web3';

import { getAllTokens } from './selectors';
import TokenWhitelist from './whitelist';

export * from './selectors';

// Actions
const SET_MARKETS = 'SET_MARKETS';
const SET_TOKENS = 'SET_TOKENS';
const UPDATE_BALANCES = 'UPDATE_BALANCES';
const SET_TOKEN_ALLOWANCE = 'SET_TOKEN_ALLOWANCE';

const initialState: TokensState = {
  markets: [],
  tokens: new Map<Address, Token>(),
};

const reducer: Reducer<TokensState> = (state = initialState, action) => {
  switch (action.type) {
    case SET_MARKETS:
      return {
        ...state,
        markets: Array.from(action.payload),
      };

    case SET_TOKENS:
    case UPDATE_BALANCES:
      return {
        ...state,
        tokens: new Map<Address, Token>(action.payload.map((token: Token) => [token.address, token])),
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

export function loadTokens() {
  return async (dispatch: any, getState: () => AppState) => {
    const accountAddress = getCurrentAccount(getState());
    const network = getNetworkType(getState());

    const whitelist = new TokenWhitelist(network);

    if (accountAddress) {
      const markets: Market[] = (await dx.getAvailableMarkets()).filter(([token1, token2]) => {
        return whitelist.isWhitelisted(token1) && whitelist.isWhitelisted(token2);
      });

      dispatch(setMarkets(markets));

      const tokenAddresses = markets.reduce<Set<Address>>(
        (addresses, [token1, token2]) => addresses.add(token1).add(token2),
        new Set(),
      );

      // Load tokens that require special treatment
      const [wethAddress, owlAddress] = await Promise.all([dx.getEthTokenAddress(), dx.getOwlAddress()]);
      const [isWethListed, isOwlListed] = [tokenAddresses.has(wethAddress), tokenAddresses.has(owlAddress)];

      if (!isWethListed) {
        tokenAddresses.add(wethAddress);
      }

      if (!isOwlListed) {
        tokenAddresses.add(owlAddress);
      }

      // Create contract instance for each whitelisted token
      const tokens = await Promise.all(
        Array.from(tokenAddresses.values()).map<Promise<Token>>(async tokenAddress => {
          const token = await getErc20Contract(tokenAddress).getTokenInfo();

          // Get token data from whitelist if needed
          if (!token.name || !token.symbol) {
            const whitelisted = whitelist.getTokenData(tokenAddress);

            if (whitelisted) {
              token.name = token.name || whitelisted.name;
              token.symbol = token.symbol || whitelisted.symbol;
            }
          }

          // Tokens are tradeable by default
          token.tradeable = true;

          if (tokenAddress === owlAddress) {
            token.tradeable = isOwlListed;
          } else if (tokenAddress === wethAddress) {
            token.tradeable = isWethListed;
          }

          return token;
        }),
      );

      dispatch(setTokens(tokens));

      if (tokens.length > 0) {
        dispatch(updateBalances());

        // Load auctions if needed
        const { blockchain } = getState();

        if (!blockchain.auctions) {
          dispatch(loadAuctions());
        }
      }
    }
  };
}

export function updateBalances() {
  return async (dispatch: any, getState: () => AppState) => {
    const accountAddress = getCurrentAccount(getState());
    const tokens = Array.from(getAllTokens(getState()).values());

    if (tokens.length) {
      const tokensWithBalances = await Promise.all(
        tokens.map(async token => {
          const tokenContract = getErc20Contract(token.address);

          const [contractBalance, walletBalance, priceEth, allowance] = await Promise.all([
            dx.getBalance(token, accountAddress),
            tokenContract.getBalance(accountAddress),
            dx.getPriceOfTokenInLastAuction(token),
            tokenContract.getAllowance(accountAddress, dx.address),
          ]);

          return {
            ...token,
            balance: [contractBalance, walletBalance],
            priceEth: priceEth.value,
            allowance,
          };
        }),
      );

      dispatch(setBalances(tokensWithBalances));
    }
  };
}

export const updateTokenAllowance = (token: Token) => {
  return async (dispatch: any, getState: () => AppState) => {
    const currentAccount = getCurrentAccount(getState());
    const tokenContract = getErc20Contract(token.address);

    const allowance = await tokenContract.getAllowance(currentAccount, window.dx.address);

    dispatch(setTokenAllowance(token.address, allowance));
  };
};

const setMarkets: ActionCreator<AnyAction> = (markets: Market[]) => {
  return {
    type: SET_MARKETS,
    payload: markets,
  };
};

const setTokens: ActionCreator<AnyAction> = (tokens: Token[]) => {
  return {
    type: SET_TOKENS,
    payload: tokens,
  };
};

const setBalances: ActionCreator<AnyAction> = (tokensWithBalances: Token[]) => {
  return {
    type: UPDATE_BALANCES,
    payload: tokensWithBalances,
  };
};

const setTokenAllowance: ActionCreator<Action> = (address: Address, allowance: BigNumber) => {
  return {
    type: SET_TOKEN_ALLOWANCE,
    payload: { address, allowance },
  };
};

export default reducer;
