interface AuctionsState {
  list: Auction[];
}

type AuctionState = 'running' | 'ended' | 'scheduled';

interface Auction {
  state: AuctionState;
  auctionIndex: number;
  sellToken: TokenId;
  buyToken: TokenId;
  sellTokenAddress: Address;
  buyTokenAddress: Address;
  auctionStart: string;
  auctionEnd: string;
  sellVolume: number;
  buyVolume: number;
  closingPrice: number;
  priceIncrement: number;
}

interface TokenInfo {
  id: TokenId;
  name: string;
  count: number;
}
