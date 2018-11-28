interface AuctionsState {
  list: Auction[];
}

type AuctionState = 'running' | 'ended' | 'scheduled';

interface Auction {
  state: AuctionState;
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
