import { Action, ActionCreator, AnyAction, Reducer } from 'redux';

import { getErc20Contract } from '../../../contracts';
import { loadAuctions } from '../auctions';
import { getCurrentAccount, getNetworkType } from '../web3';

import whitelist from './whitelist';

export * from './selectors';

// Actions
const SET_TOKENS = 'SET_TOKENS';
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

    if (accountAddress) {
      const tokens = await getAvailableTokens(getNetworkType(getState()));

      if (tokens.length > 0) {
        const tokensWithBalances = await Promise.all(
          Array.from(tokens).map(token => getTokenBalances(token, accountAddress)),
        );

        dispatch(setTokens(tokensWithBalances));

        // Load auctions if needed
        const { blockchain } = getState();

        if (!blockchain.auctions) {
          dispatch(loadAuctions());
        }
      }
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

const setTokens: ActionCreator<AnyAction> = (tokens: Token[]) => {
  return {
    type: SET_TOKENS,
    payload: tokens,
  };
};

const setTokenAllowance: ActionCreator<Action> = (address: Address, allowance: BigNumber) => {
  return {
    type: SET_TOKEN_ALLOWANCE,
    payload: { address, allowance },
  };
};

async function getAvailableTokens(network: Network | null) {
  const markets = await dx.getAvailableMarkets();

  const tokenAddresses = markets.reduce<Set<Address>>(
    (addresses, market) => addresses.add(market[0]).add(market[1]),
    new Set(),
  );

  // Filter non-whitelisted token
  const whitelistedTokens = network && whitelist[network];

  if (whitelistedTokens != null) {
    tokenAddresses.forEach(address => {
      const isWhitelisted = whitelistedTokens.some(
        approvedToken => approvedToken.address.toLowerCase() === address.toLowerCase(),
      );

      if (!isWhitelisted) {
        tokenAddresses.delete(address);
      }
    });
  }

  // Load tokens that require special treatment
  const [wethAddress, owlAddress] = await Promise.all([dx.getEthTokenAddress(), dx.getOwlAddress()]);

  const isWethListed = tokenAddresses.has(wethAddress);
  const isOwlListed = tokenAddresses.has(owlAddress);

  if (!isWethListed) {
    tokenAddresses.add(wethAddress);
  }

  if (!isOwlListed) {
    tokenAddresses.add(owlAddress);
  }

  // Create contract instance for each token
  const tokens = await Promise.all(
    Array.from(tokenAddresses.values()).map<Promise<Token>>(async tokenAddress => {
      const token = await getErc20Contract(tokenAddress).getTokenInfo();

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

  return tokens.filter((token: Token) => !token.symbol.startsWith('test'));
}

async function getTokenBalances(token: Token, account: Address) {
  const tokenContract = getErc20Contract(token.address);

  const [contractBalance, walletBalance, priceEth, allowance] = await Promise.all([
    dx.getBalance(token, account),
    tokenContract.getBalance(account),
    dx.getPriceOfTokenInLastAuction(token),
    tokenContract.getAllowance(account, dx.address),
  ]);

  token.balance = [contractBalance, walletBalance];
  token.priceEth = priceEth.value;
  token.allowance = allowance;

  return token;
}

export default reducer;
