type BlockchainState = AuctionsState & TokensState & WalletState & BuyOrdersState & FrtState;

interface AuctionsState {
  auctions?: Auction[];
}

interface TokensState {
  feeRatio?: BigNumber;
  tokens: Map<Address, Token>;
}

interface FrtState {
  frt?: Token;
}

interface WalletState {
  currentAccount?: Address;
  networkId?: number;
  wallet?: Wallet;
}

interface BuyOrdersState {
  buyOrders?: BuyOrder[];
}
