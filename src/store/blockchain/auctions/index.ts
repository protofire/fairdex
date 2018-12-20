import { ActionCreator, AnyAction, Reducer } from 'redux';

import { fromFraction, toBigNumber } from '../../../contracts/utils';
import { periodicAction } from '../../utils';

export * from './selectors';

// Actions
const SET_AUCTION_LIST = 'SET_AUCTION_LIST';
const ADD_BUY_ORDER = 'ADD_BUY_ORDER';

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case SET_AUCTION_LIST:
      return {
        ...state,
        auctions: action.payload,
      };
    case ADD_BUY_ORDER:
      return {
        ...state,
        buyOrders: [...state.buyOrders, action.payload],
      };

    default:
      return state;
  }
};

export function loadAuctions() {
  return periodicAction({
    name: 'loadAuctions',
    interval: 60_000, // check for running auction every 1 minute,

    async task(dispatch, getState) {
      const { blockchain } = getState();

      const markets = await dx.getAvailableMarkets();
      const accountAddress = blockchain.currentAccount;

      const tokensCombinations = markets.reduce<Array<[Token, Token]>>((result, market) => {
        const t1 = blockchain.tokens.get(market[0].toLowerCase());
        const t2 = blockchain.tokens.get(market[1].toLowerCase());

        if (t1 && t2) {
          result.push([t1, t2], [t2, t1]);
        }

        return result;
      }, []);

      if (markets.length) {
        const auctionList: Auction[] = [];

        await Promise.all(
          tokensCombinations.map(async ([sellToken, buyToken]) => {
            let state: AuctionState = 'running';

            let auctionIndex = await dx.getLatestAuctionIndex(sellToken, buyToken);

            while (toBigNumber(auctionIndex).gte(0) && state !== 'ended') {
              const [auctionStart, sellVolume, buyVolume] = await Promise.all([
                dx.getAuctionStart(sellToken, buyToken),
                dx.getSellVolume(sellToken, buyToken),
                dx.getBuyVolume(sellToken, buyToken),
              ]);

              const [price, closingPrice, previousClosingPrice, buyerBalance] = await Promise.all([
                dx.getPrice(sellToken, buyToken, auctionIndex),
                dx.getClosingPrice(sellToken, buyToken, auctionIndex),
                dx.getPreviousClosingPrice(sellToken, buyToken, auctionIndex),
                dx.getBuyerBalances(sellToken, buyToken, auctionIndex, accountAddress),
              ]);

              const hasAuctionStarted = auctionStart && auctionStart < Date.now();

              const isClosed =
                !sellVolume || !sellVolume.isFinite() || sellVolume.isZero()
                  ? hasAuctionStarted
                  : closingPrice && closingPrice.isFinite();

              const isTheoreticalClosed =
                price && hasAuctionStarted
                  ? toBigNumber(price.num)
                      .times(sellVolume || 0)
                      .minus(toBigNumber(price.den).times(buyVolume || 0))
                      .isZero()
                  : false;

              if (auctionStart && auctionStart >= Date.now()) {
                state = 'scheduled';
              } else if (isClosed || isTheoreticalClosed) {
                state = 'ended';
              } else {
                state = 'running';
              }

              auctionList.push({
                auctionIndex,
                sellToken: sellToken.symbol,
                sellTokenAddress: sellToken.address,
                sellVolume,
                buyToken: buyToken.symbol,
                buyTokenAddress: buyToken.address,
                buyVolume,
                auctionStart,
                auctionEnd: null,
                closingPrice: previousClosingPrice,
                currentPrice: fromFraction(price),
                buyerBalance,
                state,
              });

              auctionIndex = toBigNumber(auctionIndex)
                .minus(1)
                .toString(10);
            }
          }),
        );

        dispatch(setAuctionList(auctionList));
      }
    },
  });
}

const setAuctionList: ActionCreator<AnyAction> = (auctions: Auction[]) => {
  return {
    type: SET_AUCTION_LIST,
    payload: auctions,
  };
};

export const addBuyOrder: ActionCreator<AnyAction> = (buyOrder: BuyOrder) => {
  return {
    type: ADD_BUY_ORDER,
    payload: buyOrder,
  };
};

export default reducer;
