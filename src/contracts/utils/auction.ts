import { addHours } from 'date-fns';

const AUCTION_DURATION = 6; // 6 hours

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
