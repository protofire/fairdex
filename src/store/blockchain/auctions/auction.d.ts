type Auction = RunningAuction | ScheduledAuction | EndedAuction;

interface AuctionData {
  state?: 'running' | 'scheduled' | 'ended';
  auctionIndex: string;
  sellToken: TokenSymbol;
  sellTokenAddress: Address;
  sellVolume: BigNumber;
  buyToken: TokenSymbol;
  buyTokenAddress: Address;
  buyVolume: BigNumber;
  buyerBalance?: BigNumber;
}

interface RunningAuction extends AuctionData {
  state: 'running';
  auctionStart: number;
  currentPrice: BigNumber;
  closingPrice: BigNumber;
}

interface ScheduledAuction extends AuctionData {
  state: 'scheduled';
  auctionStart: number;
  closingPrice: BigNumber;
}

interface EndedAuction extends AuctionData {
  state: 'ended';
  auctionEnd: number;
  closingPrice: BigNumber;
}
