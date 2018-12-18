import { ActionCreator, AnyAction, Reducer } from 'redux';

import { periodicAction } from '../../utils';
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

export function loadRunningAuctions() {
  const { dx } = window;

  return periodicAction(
    async (dispatch, getState) => {
      const tokens = getAvailableTokens(getState());
      const tokenAddresses = Object.keys(tokens);

      if (tokenAddresses.length) {
        const runningTokenPairs = await dx.getRunningTokenPairs(tokenAddresses);

        const tokensCombinations = runningTokenPairs.reduce<Array<[Address, Address]>>(
          (res, [t1, t2]) => [...res, [t1, t2], [t2, t1]],
          [],
        );

        const runningAuctions = await Promise.all(
          tokensCombinations.map(
            async ([sellTokenAddress, buyTokenAddress]): Promise<Auction | null> => {
              const sellToken = tokens[sellTokenAddress];
              const buyToken = tokens[buyTokenAddress];

              if (!sellToken || !buyToken) {
                return null;
              }

              const [auctionIndex, auctionStart, sellVolume, buyVolume] = await Promise.all([
                dx.getLatestAuctionIndex(sellToken, buyToken),
                dx.getAuctionStart(sellToken, buyToken),
                dx.getSellVolume(sellToken, buyToken),
                dx.getBuyVolume(sellToken, buyToken),
              ]);

              const [closingPrice, currentPrice] = await Promise.all([
                dx.getPreviousClosingPrice(sellToken, buyToken, auctionIndex),
                dx.getCurrentPrice(sellToken, buyToken, auctionIndex),
              ]);

              return {
                auctionIndex,
                sellToken: sellToken.symbol,
                sellTokenAddress,
                sellVolume,
                buyToken: buyToken.symbol,
                buyTokenAddress,
                buyVolume,
                auctionStart,
                auctionEnd: null,
                closingPrice,
                currentPrice,
                state: 'running',
              };
            },
          ),
        );

        dispatch(
          setRunningAuctions(
            runningAuctions.filter(a => a != null), // Filter auctions of test/unknown tokens
          ),
        );
      }
    },
    60_000, // check for running auction every 1 minute
  );
}

const setRunningAuctions: ActionCreator<AnyAction> = (auctions: Auction[]) => {
  return {
    type: SET_RUNNING_AUCTIONS,
    payload: auctions,
  };
};

export default reducer;
