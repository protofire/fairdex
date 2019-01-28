import { addHours, isAfter } from 'date-fns';

import { formatNumber, toBigNumber, ZERO } from './decimal';

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

export async function getUnclaimedFunds(
  sellToken: Token,
  buyToken: Token,
  auctionIndex: string,
  currentAccount: Address,
) {
  const unclaimedFunds = dx.getUnclaimedFunds(sellToken, buyToken, auctionIndex, currentAccount);

  return unclaimedFunds;
}

export function getAvailableVolume(auction: RunningAuction) {
  if (auction.sellVolume && auction.sellVolume.gt(0)) {
    if (auction.buyVolume && auction.buyVolume.gte(0)) {
      if (auction.currentPrice && auction.currentPrice.gte(0)) {
        return auction.sellVolume.minus(auction.buyVolume.div(auction.currentPrice));
      }
    }
  }

  return ZERO;
}

export function getEstimatedEndTime(auction: RunningAuction) {
  if (auction.auctionStart) {
    const estimatedEndTime = addHours(auction.auctionStart, AUCTION_DURATION);

    return estimatedEndTime;
  }

  return undefined;
}

export function isAbovePriorClosingPrice(auction: Auction) {
  if (auction.state !== 'running' || auction.currentPrice == null || auction.closingPrice == null) {
    return false;
  }

  return auction.currentPrice.isGreaterThan(auction.closingPrice.times(AUCTION_ABOVE_PRIOR_PRICE_THRESHOLD));
}

export function getSellVolumeInEth(auction: Auction, tokens: Map<Address, Token>) {
  const sellToken = tokens.get(auction.sellTokenAddress);

  if (
    auction.sellVolume &&
    auction.sellVolume.gt(0) &&
    sellToken &&
    sellToken.priceEth &&
    sellToken.priceEth.gt(0)
  ) {
    return auction.sellVolume.times(sellToken.priceEth);
  }

  return ZERO;
}

export function getPriceRate(value: BigNumber, sellToken: string, buyToken: string, decimals = 6) {
  if (!value || !value.isFinite() || value.lte(0)) {
    return '';
  }

  const formatted = formatNumber(value, { decimals });
  const formattedInverse = formatNumber(value.pow(-1), { decimals });

  return `1 ${sellToken} = ${formatted} ${buyToken}\n` + `1 ${buyToken} = ${formattedInverse} ${sellToken}`;
}

export function getCurrentPriceRate(auction: RunningAuction, decimals?: number) {
  return getPriceRate(auction.currentPrice, auction.sellToken, auction.buyToken, decimals);
}

export function getClosingPriceRate(auction: Auction, decimals?: number) {
  return getPriceRate(auction.closingPrice, auction.sellToken, auction.buyToken, decimals);
}

export async function getBuyerBalance(
  sellToken: Token,
  buyToken: Token,
  auctionIndex: string,
  currentAccount: Address,
) {
  const buyerBalance = dx.getBuyerBalance(sellToken, buyToken, auctionIndex, currentAccount);

  return buyerBalance;
}

export function getTotalClaimFound(auction: Auction) {
  if (auction.closingPrice == null || auction.buyerBalance == null) {
    return ZERO;
  }

  return auction.buyerBalance.dividedBy(auction.closingPrice);
}
