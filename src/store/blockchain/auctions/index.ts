import { ActionCreator, AnyAction, Reducer } from 'redux';

import { toBigNumber, ZERO } from '../../../contracts/utils';
import { getAuctionInfo, getBuyerBalance, getUnclaimedFunds } from '../../../contracts/utils/auctions';

import { getAllBuyOrders } from '../buy-orders';
import { getAllTokens, getAvailableMarkets, getToken } from '../tokens';
import { getCurrentAccount } from '../web3';

export * from './selectors';

// Actions
const SET_AUCTION_LIST = 'SET_AUCTION_LIST';
const UPDATE_AUCTION_DATA = 'UPDATE_AUCTION_DATA';

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case SET_AUCTION_LIST:
      return {
        ...state,
        auctions: action.payload,
      };

    case UPDATE_AUCTION_DATA:
      return {
        ...state,
        auctions:
          state.auctions &&
          state.auctions.map(auction => {
            const { sellTokenAddress, buyTokenAddress, auctionIndex } = action.payload.auction;

            if (
              auction.sellTokenAddress.toLowerCase() === sellTokenAddress.toLowerCase() &&
              auction.buyTokenAddress.toLowerCase() === buyTokenAddress.toLowerCase() &&
              auction.auctionIndex === auctionIndex
            ) {
              return {
                ...auction,
                buyVolume: action.payload.buyVolume,
                currentPrice: action.payload.currentPrice,
              };
            }

            return auction;
          }),
      };

    default:
      return state;
  }
};

export function loadAuctions() {
  return async (dispatch: any, getState: () => AppState) => {
    const auctions: Auction[] = [];

    const markets = getAvailableMarkets(getState());
    const tokens = getAllTokens(getState());

    if (markets.length && tokens.size) {
      const tokensCombinations = markets.reduce<Array<[Token, Token]>>((result, market) => {
        const t1 = getToken(getState(), market[0]);
        const t2 = getToken(getState(), market[1]);

        if (t1 && t2) {
          result.push([t1, t2], [t2, t1]);
        }

        return result;
      }, []);

      await Promise.all(
        tokensCombinations.map(async ([sellToken, buyToken]) => {
          let auction: Auction | undefined;

          let auctionIndex = await dx.getLatestAuctionIndex(sellToken, buyToken);

          do {
            auction = await getAuctionInfo(sellToken, buyToken, auctionIndex);

            if (auction) {
              const currentAccount = getCurrentAccount(getState());

              const [unclaimedFunds, buyerBalance] = await Promise.all([
                getUnclaimedFunds(sellToken, buyToken, auctionIndex, currentAccount),
                getBuyerBalance(sellToken, buyToken, auctionIndex, currentAccount),
              ]);

              auction.unclaimedFunds = unclaimedFunds;
              auction.buyerBalance = buyerBalance;

              auctions.push(auction);

              auctionIndex = toBigNumber(auctionIndex)
                .minus(1)
                .toString(10);
            }
          } while (!auctionIndex.startsWith('-') && auction && auction.state !== 'ended');
        }),
      );

      // Append claimable auctions
      const buyOrders = getAllBuyOrders(getState());

      if (buyOrders) {
        await Promise.all(
          buyOrders.map(async order => {
            const sellToken = tokens.get(order.sellToken);
            const buyToken = tokens.get(order.buyToken);
            const auctionIndex = order.auctionIndex;

            if (sellToken && buyToken && auctionIndex) {
              const alreadyInList = auctions.find(
                auction =>
                  auction.sellTokenAddress === sellToken.address &&
                  auction.buyTokenAddress === buyToken.address &&
                  auction.auctionIndex === auctionIndex,
              );

              if (!alreadyInList) {
                const auction = await getAuctionInfo(sellToken, buyToken, auctionIndex);

                if (auction && auction.state === 'ended') {
                  const currentAccount = getCurrentAccount(getState());

                  const [unclaimedFunds, buyerBalance] = await Promise.all([
                    getUnclaimedFunds(sellToken, buyToken, auctionIndex, currentAccount),
                    getBuyerBalance(sellToken, buyToken, auctionIndex, currentAccount),
                  ]);

                  auction.unclaimedFunds = unclaimedFunds;
                  auction.buyerBalance = buyerBalance;

                  if (auction.unclaimedFunds && auction.unclaimedFunds.gt(0)) {
                    auctions.push(auction);
                  }
                }
              }
            }
          }),
        );
      }

      dispatch(setAuctionList(auctions));
    }
  };
}

export function updateAuction(auction: Auction) {
  return async (dispatch: any, getState: () => AppState) => {
    if (auction) {
      const sellToken = getToken(getState(), auction.sellTokenAddress);
      const buyToken = getToken(getState(), auction.buyTokenAddress);

      if (sellToken && buyToken) {
        const [currentPrice, buyVolume = ZERO] = await Promise.all([
          dx.getCurrentPrice(sellToken, buyToken, auction.auctionIndex),
          dx.getBuyVolume(sellToken, buyToken),
        ]);

        dispatch(updateAuctionData(auction, currentPrice.value, buyVolume));
      }
    }
  };
}

const setAuctionList: ActionCreator<AnyAction> = (auctions: Auction[]) => {
  return {
    type: SET_AUCTION_LIST,
    payload: auctions,
  };
};

const updateAuctionData: ActionCreator<AnyAction> = (
  auction: Auction,
  currentPrice: BigNumber,
  buyVolume: BigNumber,
) => {
  return {
    type: UPDATE_AUCTION_DATA,
    payload: {
      auction,
      buyVolume,
      currentPrice,
    },
  };
};

export default reducer;
