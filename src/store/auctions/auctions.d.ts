interface AppState {
  auctions: AuctionsState;
}

interface AuctionsState {
  running: Auction[];
  ended: Auction[];
  scheduled: Auction[];
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
