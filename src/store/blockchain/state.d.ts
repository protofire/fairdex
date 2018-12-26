type BlockchainState = AuctionsState & TokensState & WalletState & BuyOrdersState;

interface AuctionsState {
  auctions?: Auction[];
}

interface TokensState {
  feeRatio?: BigNumber;
  tokens: Map<Address, Token>;
}

interface WalletState {
  currentAccount?: Address;
  networkId?: number;
  wallet?: Wallet;
}

interface BuyOrdersState {
  buyOrders?: BuyOrder[];
}
