import { Action, ActionCreator, Reducer } from 'redux';
import Web3 from 'web3';

import { fetchAvailableTokens } from '../tokens';

export * from './selectors';

// Actions
const INIT_WALLET = 'INIT_WALLET';
const CHANGE_ACCOUNT = 'CHANGE_ACCOUNT';
const CHANGE_NETWORK = 'CHANGE_NETWORK';

const reducer: Reducer<WalletState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_WALLET:
      return {
        wallet: action.payload
      };

    case CHANGE_ACCOUNT:
      return {
        ...state,
        currentAccount: action.payload
      };

    case CHANGE_NETWORK:
      return {
        ...state,
        networkId: action.payload
      };

    default:
      return state;
  }
};

export function initWallet(wallet: Wallet) {
  return async (dispatch: any, getState: () => AppState) => {
    const web3 = await createEthereumClient();

    if (web3) {
      // Save Web3 instance
      window.web3 = web3;

      // Handle account/network switch
      const provider: any = web3.currentProvider;

      // @ts-ignore
      provider.publicConfigStore.on('update', ({ selectedAddress, networkVersion }) => {
        const { blockchain } = getState();

        if (blockchain.currentAccount !== selectedAddress) {
          dispatch(changeAccount(selectedAddress));
        }

export function connect(wallet: WalletType) {
  return async (dispatch: any, getState: any) => {
    if (wallet === 'ledger') {
      // TODO: Ledger Nano
    } else {
      const provider = window.ethereum || window.web3.currentProvider;

      window.web3 = new Web3(provider);

      if (typeof provider.enable === 'function') {
        try {
          // Request account access if needed
          await provider.enable();

          // Handle account switch
          // @ts-ignore
          provider.publicConfigStore.on('update', ({ selectedAddress, networkVersion }) => {
            const { wallet: state } = getState();

            if (state.accountAddress !== selectedAddress) {
              dispatch(changeAccount(selectedAddress));
            }

            if (state.network !== getNetworkType(networkVersion)) {
              dispatch(changeNetwork(networkVersion));

              // Reload available tokens
              dispatch(fetchAvailableTokens());
            }
          });

          dispatch(selectWallet(wallet));
        } catch (error) {
          // TODO: User denied account access
        }
      }
    }
  };
}

const selectWallet: ActionCreator<Action> = (wallet: Wallet) => {
  return {
    type: INIT_WALLET,
    payload: wallet
  };
};

const changeAccount: ActionCreator<Action> = (accountAddress: Address) => {
  return {
    type: CHANGE_ACCOUNT,
    payload: accountAddress
  };
};

const changeNetwork: ActionCreator<Action> = (networkId: string | number) => {
  return {
    type: CHANGE_NETWORK,
    payload: networkId
  };
};

export default reducer;
