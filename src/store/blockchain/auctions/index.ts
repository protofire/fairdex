import { ActionCreator, AnyAction, Reducer } from 'redux';

import { fromFraction, toBigNumber } from '../../../contracts/utils';
import { periodicAction } from '../../utils';

export * from './selectors';

// Actions
const SET_AUCTION_LIST = 'SET_AUCTION_LIST';

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case SET_AUCTION_LIST:
      return {
        ...state,
        auctions: action.payload,
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
      const currentAccount = blockchain.currentAccount;
      const buyOrders = blockchain.buyOrders;

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
              const auctionInfo = await getAuctionInfo(dx, sellToken, buyToken, auctionIndex, currentAccount);

              state = auctionInfo.state;

              auctionList.push(auctionInfo);

              auctionIndex = toBigNumber(auctionIndex)
                .minus(1)
                .toString(10);
            }
          }),
        );

        const buyOrdersAuctions = await Promise.all(
          buyOrders.map(async order => {
            const sellToken = blockchain.tokens.get(order.sellToken.toLowerCase());
            const buyToken = blockchain.tokens.get(order.buyToken.toLowerCase());
            const isOrderInList = auctionList.find(auction => {
              return (
                auction.sellTokenAddress === order.sellToken &&
                auction.buyTokenAddress === order.buyToken &&
                auction.auctionIndex === order.auctionIndex
              );
            });

            if (isOrderInList) {
              return null;
            }

            return {
              ...order,
              sellToken,
              buyToken,
            };
          }),
        );

        const buyOrdersAuctionList = await Promise.all(
          buyOrdersAuctions
            .filter(a => a !== null)
            .map(order => {
              const { sellToken, buyToken, auctionIndex } = order;
              return getAuctionInfo(dx, sellToken, buyToken, auctionIndex, currentAccount);
            }),
        );

        dispatch(
          setAuctionList([
            ...auctionList,
            ...buyOrdersAuctionList.filter(({ buyerBalance }) => buyerBalance.gt(0)),
          ]),
        );
      }
    },
  });
}

async function getAuctionInfo(dx, sellToken, buyToken, auctionIndex, currentAccount) {
  const [auctionStart, sellVolume, buyVolume] = await Promise.all([
    dx.getAuctionStart(sellToken, buyToken),
    dx.getSellVolume(sellToken, buyToken),
    dx.getBuyVolume(sellToken, buyToken),
  ]);

  const [price, closingPrice, previousClosingPrice, buyerBalance] = await Promise.all([
    dx.getPrice(sellToken, buyToken, auctionIndex),
    dx.getClosingPrice(sellToken, buyToken, auctionIndex),
    dx.getPreviousClosingPrice(sellToken, buyToken, auctionIndex),
    dx.getBuyerBalances(sellToken, buyToken, auctionIndex, currentAccount),
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

  let state = 'running';
  if (auctionStart && auctionStart >= Date.now()) {
    state = 'scheduled';
  } else if (isClosed || isTheoreticalClosed) {
    state = 'ended';
  }

  return {
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
  };
}

const setAuctionList: ActionCreator<AnyAction> = (auctions: Auction[]) => {
  return {
    type: SET_AUCTION_LIST,
    payload: auctions,
  };
};

export default reducer;
