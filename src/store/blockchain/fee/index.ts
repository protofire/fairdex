import { ActionCreator, AnyAction, Reducer } from 'redux';

import FeeReductionToken from '../../../contracts/FeeReductionToken';
import { Decimal } from '../../../contracts/utils';
import { getCurrentAccount } from '../web3';
import { getFrt } from './selectors';

export * from './selectors';

// Actions
const INIT_FEE_REDUCTION_TOKEN = 'INIT_FEE_REDUCTION_TOKEN';
const SET_FEE_RATIO = 'SET_FEE_RATIO';
const UPDATE_FRT_BALANCE = 'UPDATE_FRT_BALANCE';

let contract: FeeReductionToken;

const reducer: Reducer<FrtState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_FEE_REDUCTION_TOKEN:
      return {
        ...state,
        frt: action.payload,
      };

    case SET_FEE_RATIO:
      return {
        ...state,
        feeRatio: action.payload,
      };

    case UPDATE_FRT_BALANCE:
      return {
        ...state,
        frt: {
          ...state.frt,
          balance: [action.payload],
        },
      };

    default:
      return state;
  }
};

export function loadFeeReductionToken() {
  return async (dispatch: any, getState: () => AppState) => {
    const frt = getFrt(getState());

    if (!frt) {
      // Initialize fee reduction token
      contract = new FeeReductionToken(await dx.getFrtAddress());

      if (contract) {
        const currentAccount = getCurrentAccount(getState());

        if (currentAccount) {
          const tokenInfo = await contract.initialise(currentAccount);

          dispatch(initFrt(tokenInfo));
        }
      }
    } else {
      // Update fee reduction token balance
      if (contract) {
        const currentAccount = getCurrentAccount(getState());

        if (currentAccount) {
          const balance = await contract.getLockedTokenBalances(currentAccount);

          dispatch(setFrtBalance(balance));
        }
      }
    }
  };
}

export function loadFeeRatio() {
  return async (dispatch: any, getState: () => AppState) => {
    const account = getCurrentAccount(getState());

    if (account) {
      const ratio = await dx.getFeeRatio(account);

      if (ratio) {
        dispatch(setFeeRatio(ratio.value));
      }
    }
  };
}

const initFrt: ActionCreator<AnyAction> = (frt: Token) => {
  return {
    type: INIT_FEE_REDUCTION_TOKEN,
    payload: frt,
  };
};

const setFrtBalance: ActionCreator<AnyAction> = (balance: Decimal) => {
  return {
    type: UPDATE_FRT_BALANCE,
    payload: balance,
  };
};

const setFeeRatio: ActionCreator<AnyAction> = (ratio: BigNumber) => {
  return {
    type: SET_FEE_RATIO,
    payload: ratio,
  };
};

export default reducer;
