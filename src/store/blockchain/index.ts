import reduceReducers from 'reduce-reducers';
import { AnyAction, Reducer } from 'redux';

import { periodicAction } from '../utils';

import auctions, { loadAuctions } from './auctions';
import buyOrders, { loadBidHistory } from './buy-orders';
import frt, { loadFeeRatio, loadFeeReductionToken } from './fee';
import tokens, { loadTokens } from './tokens';
import wallet, { getCurrentAccount } from './web3';

export * from './auctions';
export * from './buy-orders';
export * from './tokens';
export * from './fee';
export * from './web3';

const reducer = reduceReducers<BlockchainState>(wallet, tokens, auctions, buyOrders, frt);

export function fetchData() {
  return async (dispatch: any, getState: () => AppState) => {
    const account = getCurrentAccount(getState());

    // Load fee rate (a.k.a. liquidity contribution))
    dispatch(
      periodicAction({
        name: 'update-fee-ratio',
        interval: 15_000, // check for tokens every 15 seconds

        async task() {
          dispatch(loadFeeRatio());
        },
      }),
    );

    // Load fee reduction token (MGN)
    dispatch(
      periodicAction({
        name: 'update-fee-reduction-token',
        interval: 15_000, // check for tokens every 15 seconds

        async task() {
          dispatch(loadFeeReductionToken());
        },
      }),
    );

    // Update tokens
    dispatch(
      periodicAction({
        name: 'update-tokens',
        interval: 15_000, // check for tokens every 15 seconds

        async task() {
          dispatch(loadTokens());
        },
      }),
    );

    // Update auctions
    dispatch(
      periodicAction({
        name: 'update-auctions',
        interval: 30_000, // check for tokens every 30 seconds
        runImmediately: false,

        async task() {
          dispatch(loadAuctions());
        },
      }),
    );

    // Load user's biding history
    dispatch(
      periodicAction({
        name: 'update-buy-orders',
        interval: 60_000, // check for tokens every minute

        async task() {
          dispatch(loadBidHistory());
        },
      }),
    );

    // Handle account switch
    if (web3 && web3.currentProvider) {
      const ethereum: any = web3.currentProvider;

      ethereum.on('accountsChanged', async () => {
        dispatch(fetchData());
      });
    }

    // Handle DutchX events
    dx.subscribe({ event: 'NewTokenPair' }, () => {
      dispatch(loadTokens());
      dispatch(loadAuctions());
    });

    dx.subscribe({ event: 'AuctionCleared' }, () => {
      dispatch(loadAuctions());
    });

    dx.subscribe({ event: 'NewBuyOrder', filter: { user: account } }, () => {
      dispatch(loadAuctions());
      dispatch(loadBidHistory());
    });

    dx.subscribe({ event: 'Fee', filter: { user: account } }, () => {
      dispatch(loadFeeRatio());
      dispatch(loadFeeReductionToken());
    });

    dx.subscribe({ event: 'NewBuyerFundsClaim', filter: { user: account } }, () => {
      dispatch(loadAuctions());
      dispatch(loadTokens());
    });

    dx.subscribe({ event: 'NewDeposit', filter: { user: account } }, () => {
      dispatch(loadTokens());
    });

    dx.subscribe({ event: 'NewWithdrawal', filter: { user: account } }, () => {
      dispatch(loadTokens());
    });
  };
}

export default reducer as Reducer<BlockchainState, AnyAction>;
