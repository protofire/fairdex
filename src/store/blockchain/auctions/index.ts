import { ActionCreator, AnyAction, Dispatch, Reducer } from 'redux';

import { getTokens } from '../tokens';

export * from './selectors';

// Actions
const SET_RUNNING_AUCTIONS = 'SET_RUNNING_AUCTIONS';

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case SET_RUNNING_AUCTIONS:
      return {
        ...state,
        auctions: action.payload
      };

    default:
      return state;
  }
};

export function fetchRunningAuctions() {
  const { dx } = window;

  return async (dispatch: Dispatch, getState: () => AppState) => {
    const state = getState();

    if (state.blockchain.tokens) {
      const tokens = getTokens(state);
      const tokenPairs = await dx.getRunningTokenPairs(Array.from(tokens.keys()));

      const runningAuctions = await Promise.all(
        tokenPairs.map(
          async ([t1, t2]): Promise<Auction> => {
            const [auctionIndex, auctionStart, sellVolume, buyVolume] = await Promise.all([
              dx.getLatestAuctionIndex(t1, t2),
              dx.getAuctionStart(t1, t2),
              dx.getSellVolume(t1, t2),
              dx.getBuyVolume(t1, t2)
            ]);

            const price = await dx.getCurrentPrice(t1, t2, auctionIndex);

            const sellTokenAddress = t1.toLowerCase();
            const sellToken = tokens.get(sellTokenAddress);
            const buyTokenAddress = t2.toLowerCase();
            const buyToken = tokens.get(buyTokenAddress);

            return {
              auctionIndex,
              sellToken: sellToken ? sellToken.symbol : '',
              sellTokenAddress,
              sellVolume,
              buyToken: buyToken ? buyToken.symbol : '',
              buyTokenAddress,
              buyVolume,
              auctionStart,
              auctionEnd: '',
              closingPrice: price,
              priceIncrement: 1,
              state: 'running'
            };
          }
        )
      );

      dispatch(setRunningAuctions(runningAuctions));
    }
  };
}

const setRunningAuctions: ActionCreator<AnyAction> = (auctions: Auction[]) => {
  return {
    type: SET_RUNNING_AUCTIONS,
    payload: auctions
  };
};

export default reducer;
