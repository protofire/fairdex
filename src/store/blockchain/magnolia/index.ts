import { ActionCreator, AnyAction, Reducer } from 'redux';

import MagnoliaToken from '../../../contracts/MagnoliaToken';
import { periodicAction } from '../../utils';

const INIT_MAGNOLIA = 'INIT_MAGNOLIA';
const UPDATE_MAGNOLIA_BALANCE = 'UPDATE_MAGNOLIA_BALANCE';

let contract;

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case INIT_MAGNOLIA:
      return {
        ...state,
        magnolia: action.payload,
      };

    case UPDATE_MAGNOLIA_BALANCE:
      return {
        ...state,
        magnolia: {
          ...state.magnolia,
          balance: action.payload,
        },
      };

    default:
      return state;
  }
};

export function updateMagnolia() {
  return periodicAction({
    name: 'updateMagnolia',
    interval: 15_000, // check for tokens every 15 seconds

    async task(dispatch, getState) {
      const {
        blockchain: { magnolia },
      } = getState();

      try {
        // Initialize Magnolia
        if (!magnolia) {
          dispatch(loadMagnolia());
        }
        {
          dispatch(updateMagnoliaBalance());
        }
      } catch (err) {
        // TODO: Handle error
      }
    },
  });
}

function loadMagnolia() {
  return async (dispatch: any, getState: () => AppState) => {
    const { dx } = window;

    const address = await dx.getFrtTokenAddress();
    contract = new MagnoliaToken(address);

    const [decimals, name, symbol] = await Promise.all([
      contract.getDecimals(),
      contract.getName(),
      contract.getSymbol(),
    ]);

    dispatch(
      initMagnolia({
        address,
        decimals,
        name,
        symbol,
      }),
    );

    dispatch(updateMagnoliaBalance());
  };
}

function updateMagnoliaBalance() {
  return async (dispatch: any, getState: () => AppState) => {
    const { blockchain } = getState();

    const { magnolia, currentAccount } = blockchain;

    if (currentAccount) {
      const balance = await contract.getLockedTokenBalances(currentAccount);

      dispatch(setMagnoliaBalance(balance));
    }
  };
}

const initMagnolia: ActionCreator<AnyAction> = (magnolia: TokenFRT) => {
  return {
    type: INIT_MAGNOLIA,
    payload: magnolia,
  };
};

const setMagnoliaBalance: ActionCreator<AnyAction> = (balance: Decimal) => {
  return {
    type: UPDATE_MAGNOLIA_BALANCE,
    payload: balance,
  };
};

export default reducer;
