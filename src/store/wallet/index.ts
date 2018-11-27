import { Reducer } from 'redux';

import * as actions from './actions';

const walletReducer: Reducer<WalletState> = (state = {}, action) => {
  switch (action.type) {
    case actions.INIT_WALLET:
      return {
        type: action.payload.wallet
      };

    case actions.CHANGE_ACCOUNT:
      return {
        ...state,
        accountAddress: action.payload.accountAddress
      };

    case actions.CHANGE_NETWORK:
      return {
        ...state,
        network: action.payload.networkType
      };

    default:
      return state;
  }
};

export default walletReducer;
