import { Action, ActionCreator, Reducer } from 'redux';
import Web3 from 'web3';

import DutchExchange from '../../../contracts/DutchExchange';
import { addBuyOrder, initBuyOrder } from '../buy-orders';
import { loadAvailableTokens, updateFeeRatio } from '../tokens';

export * from './selectors';

// Actions
const INIT_WALLET = 'INIT_WALLET';
const CHANGE_ACCOUNT = 'CHANGE_ACCOUNT';
const CHANGE_NETWORK = 'CHANGE_NETWORK';

const reducer: Reducer<WalletState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_WALLET:
      return {
        wallet: action.payload,
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

        if (blockchain.networkId !== networkVersion) {
          dispatch(changeNetwork(networkVersion));

          // Instantiate DutchX contract
          window.dx = new DutchExchange(networkVersion);

          // Load available tokens
          dispatch(loadAvailableTokens());
        }

        if (blockchain.currentAccount !== selectedAddress) {
          dispatch(changeAccount(selectedAddress));

          // Update fee ratio
          dispatch(updateFeeRatio());

          dispatch(initBuyOrder());

          dx.listenEvent('NewBuyOrder', selectedAddress, result => {
            const { sellToken, buyToken, user, auctionIndex, amount } = result.returnValues;
            dispatch(
              addBuyOrder({
                sellToken,
                buyToken,
                user,
                auctionIndex,
              }),
            );
          });
        }
      });

      dispatch(selectWallet(wallet));
    }
  };
}

const selectWallet: ActionCreator<Action> = (wallet: Wallet) => {
  return {
    type: INIT_WALLET,
    payload: wallet,
  };
};

const changeAccount: ActionCreator<Action> = (accountAddress: Address) => {
  return {
    type: CHANGE_ACCOUNT,
    payload: accountAddress,
  };
};

const changeNetwork: ActionCreator<Action> = (networkId: string | number) => {
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
