import { Action, ActionCreator } from 'redux';
import Web3 from 'web3';

export const INIT_WALLET = 'wallet/INIT';
export const CHANGE_ACCOUNT = 'wallet/ACCOUNT_CHANGED';
export const CHANGE_NETWORK = 'wallet/NETWORK_CHANGED';

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

            if (state.network !== getNetworkType(networkVersion)) {
              dispatch(changeNetwork(networkVersion));
            }

            if (state.accountAddress !== selectedAddress) {
              dispatch(changeAccount(selectedAddress));
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

const selectWallet: ActionCreator<Action> = (wallet: WalletType) => {
  return {
    type: INIT_WALLET,
    payload: {
      wallet
    }
  };
};

const changeAccount: ActionCreator<Action> = (accountAddress: Address) => {
  return {
    type: CHANGE_ACCOUNT,
    payload: {
      accountAddress
    }
  };
};

const changeNetwork: ActionCreator<Action> = (networkId: string | number) => {
  return {
    type: CHANGE_NETWORK,
    payload: {
      networkId,
      networkType: getNetworkType(networkId)
    }
  };
};

function getNetworkType(id: string | number) {
  const networkId = Number(id);

  switch (networkId) {
    case 1:
      return 'main';
    case 2:
      return 'morden';
    case 3:
      return 'ropsten';
    case 4:
      return 'rinkeby';
    case 42:
      return 'kovan';
    default:
      return 'private';
  }
}
