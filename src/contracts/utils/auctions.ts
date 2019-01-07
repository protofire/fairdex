import { addHours } from 'date-fns';

import { toBigNumber, ZERO } from './decimal';

const AUCTION_DURATION = 6; // 6 hours
const AUCTION_START_WAITING_FOR_FUNDING = 1;
const AUCTION_ABOVE_PRIOR_PRICE_THRESHOLD = 1.1; // 10% above prior price

export async function getAuctionInfo(sellToken: Token, buyToken: Token, auctionIndex: string) {
  const [auctionStart, sellVolume = ZERO, buyVolume = ZERO] = await Promise.all([
    dx.getAuctionStart(sellToken, buyToken),
    dx.getSellVolume(sellToken, buyToken),
    dx.getBuyVolume(sellToken, buyToken),
  ]);

  if (auctionStart) {
    const data: AuctionData = {
      auctionIndex,
      sellToken: sellToken.symbol,
      sellTokenAddress: sellToken.address,
      sellVolume,
      buyToken: buyToken.symbol,
      buyTokenAddress: buyToken.address,
      buyVolume,
    };

    if (auctionStart > Date.now()) {
      const previousClosingPrice = await dx.getPreviousClosingPrice(sellToken, buyToken, auctionIndex);

      const auction: ScheduledAuction = {
        ...data,
        state: 'scheduled',
        auctionStart,
        closingPrice: previousClosingPrice.value,
      };

      return auction;
    } else if (auctionStart > AUCTION_START_WAITING_FOR_FUNDING) {
      const [currentPrice, closingPrice] = await Promise.all([
        dx.getCurrentPrice(sellToken, buyToken, auctionIndex),
        dx.getClosingPrice(sellToken, buyToken, auctionIndex),
      ]);

      const isClosed = !sellVolume.isFinite() || sellVolume.isZero() || closingPrice.value.isFinite();

      const isTheoreticalClosed =
        currentPrice &&
        toBigNumber(currentPrice.numerator)
          .times(sellVolume || ZERO)
          .minus(toBigNumber(currentPrice.denominator).times(buyVolume || ZERO))
          .isZero();

      if (isClosed || isTheoreticalClosed) {
        const [auctionEnd, bidVolume = ZERO] = await Promise.all([
          dx.getAuctionEnd(sellToken, buyToken, auctionIndex),
          dx.getBuyVolume(sellToken, buyToken, auctionIndex),
        ]);

        const auction: EndedAuction = {
          ...data,
          state: 'ended',
          auctionEnd,
          buyVolume: bidVolume,
          closingPrice: closingPrice.value,
        };

        return auction;
      } else {
        const previousClosingPrice = await dx.getPreviousClosingPrice(sellToken, buyToken, auctionIndex);

        const auction: RunningAuction = {
          ...data,
          state: 'running',
          auctionStart,
          currentPrice: currentPrice.value,
          closingPrice: previousClosingPrice.value,
        };

        return auction;
      }
    }
  }
}

export async function getBuyerBalance(
  sellToken: Token,
  buyToken: Token,
  auctionIndex: string,
  currentAccount: Address,
) {
  const buyerBalance = dx.getBuyerBalances(sellToken, buyToken, auctionIndex, currentAccount);

  return buyerBalance;
}

export function getAvailableVolume(auction: Auction) {
  if (auction.sellVolume && auction.sellVolume.gt(0)) {
    if (auction.buyVolume && auction.buyVolume.gte(0)) {
      if (auction.currentPrice && auction.currentPrice.gte(0)) {
        return auction.sellVolume.minus(auction.buyVolume.div(auction.currentPrice));
      }
    }
  }

  return ZERO;
}

export function getEstimatedEndTime(auction: Auction) {
  if (auction.auctionStart) {
    return addHours(auction.auctionStart, AUCTION_DURATION);
  }

  return undefined;
}

export function isAbovePriorClosingPrice(auction: Auction) {
  if (auction.state !== 'running' || auction.currentPrice == null || auction.closingPrice == null) {
    return false;
  }

  return auction.currentPrice.isGreaterThan(auction.closingPrice.times(AUCTION_ABOVE_PRIOR_PRICE_THRESHOLD));
}

export function getSellVolumeInEth(auction: Auction, tokens: Token[]) {
  const sellToken = tokens.get(auction.sellTokenAddress);

  if (auction.sellVolume && auction.sellVolume.gt(0) && sellToken.priceEth && sellToken.priceEth.gt(0)) {
    return auction.sellVolume.times(sellToken.priceEth);
  }

  return ZERO;
}
