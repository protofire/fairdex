import { ActionCreator, AnyAction, Reducer } from 'redux';

import { toBigNumber } from '../../../contracts/utils';
import { getAuctionInfo, getBuyerBalance } from '../../../contracts/utils/auctions';
import { periodicAction } from '../../utils';
import { getToken } from '../tokens';
import { getCurrentAccount } from '../wallet';

export * from './selectors';

// Actions
const SET_AUCTION_LIST = 'SET_AUCTION_LIST';

const reducer: Reducer<AuctionsState> = (state = {}, action) => {
  switch (action.type) {
    case SET_AUCTION_LIST:
      return {
        ...state,
        auctions: Array.from(action.payload),
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
      const markets = await dx.getAvailableMarkets();

      const tokensCombinations = markets.reduce<Array<[Token, Token]>>((result, market) => {
        const t1 = getToken(getState(), market[0].toLowerCase());
        const t2 = getToken(getState(), market[1].toLowerCase());

        if (t1 && t2) {
          result.push([t1, t2], [t2, t1]);
        }

        return result;
      }, []);

      if (markets.length) {
        const auctions: Auction[] = [];

        await Promise.all(
          tokensCombinations.map(async ([sellToken, buyToken]) => {
            let auction: Auction | undefined;

            let auctionIndex = await dx.getLatestAuctionIndex(sellToken, buyToken);

            do {
              auction = await getAuctionInfo(sellToken, buyToken, auctionIndex);

              if (auction) {
                const currentAccount = getCurrentAccount(getState());

                auction.buyerBalance = await getBuyerBalance(
                  sellToken,
                  buyToken,
                  auctionIndex,
                  currentAccount,
                );

                auctions.push(auction);

                auctionIndex = toBigNumber(auctionIndex)
                  .minus(1)
                  .toString(10);
              }
            } while (!auctionIndex.startsWith('-') && auction && auction.state !== 'ended');
          }),
        );

        // Append claimable auctions
        const { blockchain } = getState();

        if (blockchain.buyOrders) {
          await Promise.all(
            blockchain.buyOrders.map(async order => {
              const sellToken = getToken(getState(), order.sellToken);
              const buyToken = getToken(getState(), order.buyToken);
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

                    auction.buyerBalance = await getBuyerBalance(
                      sellToken,
                      buyToken,
                      auctionIndex,
                      currentAccount,
                    );

                    if (auction.buyerBalance && auction.buyerBalance.gt(0)) {
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
    },
  });
}

const setAuctionList: ActionCreator<AnyAction> = (auctions: Auction[]) => {
  return {
    type: SET_AUCTION_LIST,
    payload: auctions,
  };
};

export default reducer;
