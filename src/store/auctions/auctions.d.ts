interface AppState {
  auctions: Auction[];
}

interface Auction {
  auctionIndex: number;
  sellToken: string;
  buyToken: string;
  sellTokenAddress: Address;
  buyTokenAddress: Address;
  auctionStart: string;
  auctionEnd: string;
  sellVolume: number;
  buyVolume: number;
  closingPrice: number;
  priceIncrement: number;
}
