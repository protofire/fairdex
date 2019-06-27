type Auction = RunningAuction | ScheduledAuction | EndedAuction;

interface AuctionData {
  state?: 'running' | 'scheduled' | 'ended';
  auctionIndex: string;
  sellToken: TokenSymbol;
  sellTokenDecimals: number;
  sellTokenAddress: Address;
  sellVolume: BigNumber;
  extraTokens: BigNumber;
  buyToken: TokenSymbol;
  buyTokenDecimals: number;
  buyTokenAddress: Address;
  buyVolume: BigNumber;
  unclaimedFunds?: BigNumber;
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
  auctionStart: number;
  auctionEnd: number;
  closingPrice: BigNumber;
}
