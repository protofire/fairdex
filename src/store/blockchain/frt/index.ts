import { ActionCreator, AnyAction, Reducer } from 'redux';

import FeeReductionToken from '../../../contracts/FeeReductionToken';
import { Decimal } from '../../../contracts/utils';
import { periodicAction } from '../../utils';
import { getCurrentAccount } from '../wallet';
import { getFrt } from './selectors';

export * from './selectors';

// Actions
const INIT_FEE_REDUCTION_TOKEN = 'INIT_FEE_REDUCTION_TOKEN';
const UPDATE_FRT_BALANCE = 'UPDATE_FRT_BALANCE';

let contract: FeeReductionToken;

const reducer: Reducer<FrtState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_FEE_REDUCTION_TOKEN:
      return {
        ...state,
        frt: action.payload,
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

export function loadFrtData() {
  return periodicAction({
    name: 'load-frt',
    interval: 15_000, // check for tokens every 15 seconds

    async task(dispatch, getState) {
      try {
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
      } catch (err) {
        // TODO: Handle error
      }
    },
  });
}

function loadFrt() {
  return async (dispatch: any, getState: () => AppState) => {
    const { dx } = window;

    const address = await dx.getFrtAddress();
    contract = new FeeReductionToken(address);

    await contract.initialise();

    const {
      blockchain: { currentAccount },
    } = getState();
    const frtInfo = await contract.initialise(currentAccount);

    dispatch(initFrt(frtInfo));
  };
}

function updateFrtBalance() {
  return async (dispatch: any, getState: () => AppState) => {
    const {
      blockchain: { frt, currentAccount },
    } = getState();

    if (currentAccount) {
      const balance = await contract.getLockedTokenBalances(currentAccount);

      dispatch(setFrtBalance(balance));
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

export default reducer;
