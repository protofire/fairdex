export function isAbovePriorClosingPrice(auction: Auction) {
  if (auction.currentPrice == null || auction.closingPrice == null) {
    return false;
  }

  return auction.currentPrice.isLessThan(auction.closingPrice);
}

export function getToEndVolume(auction: Auction) {
  const { sellVolume, buyVolume } = auction;

  if (!sellVolume || !sellVolume.isFinite() || !buyVolume || !buyVolume.isFinite()) {
    return undefined;
  }

  return sellVolume.minus(buyVolume);
}
