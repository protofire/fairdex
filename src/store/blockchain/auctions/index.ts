import { ActionCreator, AnyAction, Dispatch, Reducer } from 'redux';

import { getAvailableTokens } from '../tokens';

export * from './selectors';

// Actions
const SET_RUNNING_AUCTIONS = 'SET_RUNNING_AUCTIONS';

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case SET_RUNNING_AUCTIONS:
      return {
        ...state,
        auctions: action.payload,
      };

    default:
      return state;
  }
};

const RUNNING_AUCTION_INTERVAL = 1000 * 60; // 1 minute

export function fetchRunningAuctions() {
  const { dx } = window;

  let subscription: any;

  return async (dispatch: Dispatch, getState: () => AppState) => {
    await checkForUpdates();

    async function checkForUpdates() {
      const state = getState();
      const tokens = getAvailableTokens(state);
      const tokenAddresses = Object.keys(tokens);

      if (tokenAddresses.length) {
        const tokenPairs = await dx.getRunningTokenPairs(tokenAddresses);

        const runningAuctions = await Promise.all(
          tokenPairs.map(
            async ([t1, t2]): Promise<Auction> => {
              const sellToken = tokens[t1.toLowerCase()];
              const buyToken = tokens[t2.toLowerCase()];

              const [auctionIndex, auctionStart, sellVolume, buyVolume] = await Promise.all([
                dx.getLatestAuctionIndex(sellToken, buyToken),
                dx.getAuctionStart(sellToken, buyToken),
                dx.getSellVolume(sellToken, buyToken),
                dx.getBuyVolume(sellToken, buyToken),
              ]);

              const currentPrice = await dx.getCurrentPrice(sellToken, buyToken, auctionIndex);

              return {
                auctionIndex,
                sellToken: sellToken ? sellToken.symbol : '',
                sellTokenAddress: sellToken ? sellToken.address : '',
                sellVolume,
                buyToken: buyToken ? buyToken.symbol : '',
                buyTokenAddress: buyToken ? buyToken.address : '',
                buyVolume,
                auctionStart,
                auctionEnd: '',
                currentPrice,
                state: 'running',
              };
            },
          ),
        );

        dispatch(setRunningAuctions(runningAuctions));
      }

      clearTimeout(subscription);
      subscription = setTimeout(checkForUpdates, RUNNING_AUCTION_INTERVAL);
    }
  };
}

const setRunningAuctions: ActionCreator<AnyAction> = (auctions: Auction[]) => {
  return {
    type: SET_RUNNING_AUCTIONS,
    payload: auctions,
  };
};

export default reducer;
