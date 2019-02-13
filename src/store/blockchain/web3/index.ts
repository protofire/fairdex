import { Action, ActionCreator, Reducer } from 'redux';
import Web3 from 'web3';

import DutchExchange from '../../../contracts/DutchExchange';

export * from './selectors';

const WALLET_STORAGE_KEY = 'wallet';

// Actions
const INIT_WEB3_PROVIDER = 'INIT_WEB3_PROVIDER';
const CHANGE_ACCOUNT = 'CHANGE_ACCOUNT';

const storage = localStorage.getItem(WALLET_STORAGE_KEY);

const initialState: WalletState = {
  wallet: storage ? storage : undefined,
};

const reducer: Reducer<WalletState> = (state = initialState, action) => {
  switch (action.type) {
    case INIT_WEB3_PROVIDER:
      return {
        wallet: action.payload.wallet,
        currentAccount: action.payload.account,
        networkId: action.payload.network,
      };

    case CHANGE_ACCOUNT:
      return {
        wallet: state.wallet,
        networkId: state.networkId,
        currentAccount: action.payload,
      };

    default:
      return state;
  }
};

export function init(wallet: Wallet) {
  return async (dispatch: any) => {
    const web3 = await createEthereumClient();

    if (web3) {
      // Save selected wallet
      localStorage.setItem(WALLET_STORAGE_KEY, wallet);

      const [networkId, [accountAddress]] = await Promise.all([web3.eth.net.getId(), web3.eth.getAccounts()]);

      dispatch(initWeb3Provider(wallet, networkId, accountAddress));

      // Save Web3 instance
      window.web3 = web3;

      // Instantiate DutchX contract
      window.dx = new DutchExchange(networkId);

      // Handle account/network change
      const ethereum: any = web3.currentProvider;

      ethereum.on('accountsChanged', async ([newAccount]: Address[]) => {
        if (newAccount) {
          dispatch(changeAccount(newAccount));
        }
      });

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

const initWeb3Provider: ActionCreator<Action> = (wallet: Wallet, network: number, account: Address) => {
  return {
    type: INIT_WEB3_PROVIDER,
    payload: { wallet, network, account },
  };
};

const changeAccount: ActionCreator<Action> = (accountAddress: Address) => {
  return {
    type: CHANGE_ACCOUNT,
    payload: accountAddress,
  };
};

export default reducer;
