import { Action, ActionCreator, Reducer } from 'redux';
import Web3 from 'web3';

import DutchExchange from '../../../contracts/DutchExchange';
import { loadAuctions } from '../auctions';
import { addBuyOrder, initBuyOrder } from '../buy-orders';
import { updateFrt } from '../frt';
import { loadAvailableTokens, loadTokens, updateFeeRatio } from '../tokens';

export * from './selectors';

const WALLET_STORAGE_KEY = 'wallet';

// Actions
const INIT_WALLET = 'INIT_WALLET';
const CHANGE_ACCOUNT = 'CHANGE_ACCOUNT';
const CHANGE_NETWORK = 'CHANGE_NETWORK';

const reducer: Reducer<WalletState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_WALLET:
      return {
        wallet: action.payload.wallet,
        currentAccount: action.payload.account,
        networkId: action.payload.network,
      };

    case CHANGE_ACCOUNT:
      return {
        ...state,
        currentAccount: action.payload,
      };

    case CHANGE_NETWORK:
      return {
        ...state,
        networkId: action.payload,
      };

    default:
      return state;
  }
};

export function initWallet(wallet: Wallet) {
  return async (dispatch: any) => {
    const web3 = await createEthereumClient();

    if (web3) {
      const ethereum: any = web3.currentProvider;

      // Save Web3 instance
      window.web3 = web3;

      const [networkId, [accountAddress]] = await Promise.all([web3.eth.net.getId(), web3.eth.getAccounts()]);

      // Instantiate DutchX contract
      window.dx = new DutchExchange(networkId);

      dispatch(updateFrt());

      dispatch(selectWallet(wallet, networkId, accountAddress));

      // Save selected wallet
      localStorage.setItem(WALLET_STORAGE_KEY, wallet);

      // Load list of available tokens
      dispatch(loadAvailableTokens());

      await accountChangeHandler(dispatch, accountAddress);

      // Handle user account change
      ethereum.on('accountsChanged', async ([account]: Address[]) => {
        dispatch(changeAccount(account));

        await accountChangeHandler(dispatch, account);
      });

      // Handle network change
      ethereum.on('networkChanged', () => {
        // Just reload page on network changed. MetaMask currently reloads pages but not immediately
        // besides MetaMask team is planning to change this behavior soon
        location.reload();
      });
    }
  };
}

export function getPreviouslyUsedWallet() {
  return localStorage.getItem(WALLET_STORAGE_KEY) as Wallet;
}

async function accountChangeHandler(dispatch: any, account: Address) {
  const buyOrders = await dx.getBuyOrders(account);
  const lastBuyOrderBlock = buyOrders.length ? buyOrders[buyOrders.length - 1].blockNumber + 1 : 0;

  dispatch(initBuyOrder(buyOrders));

  dx.subscribe(
    { event: 'NewBuyOrder', fromBlock: lastBuyOrderBlock, filter: { user: account } },
    ({ sellToken, buyToken, auctionIndex }, { blockNumber }) => {
      dispatch(
        addBuyOrder({
          blockNumber,
          sellToken: sellToken.toLowerCase(),
          buyToken: buyToken.toLowerCase(),
          auctionIndex,
        }),
      );

      // Load auctions
      dispatch(loadAuctions());
    },
  );

  // Update tokens
  dispatch(loadTokens());

  // Load auctions
  dispatch(loadAuctions());

  // Update fee ratio
  dispatch(updateFeeRatio());
}

const selectWallet: ActionCreator<Action> = (wallet: Wallet, network: number, account: Address) => {
  return {
    type: INIT_WALLET,
    payload: { wallet, network, account },
  };
};

const changeAccount: ActionCreator<Action> = (accountAddress: Address) => {
  return {
    type: CHANGE_ACCOUNT,
    payload: accountAddress,
  };
};

const changeNetwork: ActionCreator<Action> = (networkId: number) => {
  return {
    type: CHANGE_NETWORK,
    payload: networkId,
  };
};

const createEthereumClient = async () => {
  const provider: any = window.ethereum || window.web3.currentProvider;

  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    try {
      // Request account access if needed
      await provider.enable();

      return web3;
    } catch (error) {
      // TODO: User denied account access
      return undefined;
    }
  } else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  }
};

export default reducer;
