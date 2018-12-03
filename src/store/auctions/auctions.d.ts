interface AuctionsState {
  list: Auction[];
}

type AuctionState = 'running' | 'ended' | 'scheduled';

interface Auction {
  state: AuctionState;
  auctionIndex: number;
  sellToken: TokenSymbol;
  buyToken: TokenSymbol;
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
  id: TokenSymbol;
  name: string;
  count: number;
}
