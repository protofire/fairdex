import { addHours } from 'date-fns';

import { ZERO } from './decimal';

const AUCTION_DURATION = 6; // 6 hours

export function getAvailableVolume(auction: Auction) {
  if (auction.sellVolume && auction.sellVolume.gt(0)) {
    if (auction.buyVolume && auction.buyVolume.gt(0)) {
      if (auction.currentPrice && auction.currentPrice.gt(0)) {
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

export function getToEndVolume(auction: Auction) {
  const { sellVolume, buyVolume } = auction;

  if (!sellVolume || !sellVolume.isFinite() || !buyVolume || !buyVolume.isFinite()) {
    return undefined;
  }

  return sellVolume.minus(buyVolume);
}

export function isAbovePriorClosingPrice(auction: Auction) {
  if (auction.currentPrice == null || auction.closingPrice == null) {
    return false;
  }

  return auction.currentPrice.isLessThan(auction.closingPrice);
}
