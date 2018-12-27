type BlockchainState = AuctionsState & TokensState & WalletState & BuyOrdersState & MagnoliaState;

interface AuctionsState {
  auctions?: Auction[];
}

interface TokensState {
  feeRatio?: BigNumber;
  tokens: Map<Address, TokenERC20>;
}

interface MagnoliaState {
  magnolia: TokenFRT;
}

interface WalletState {
  currentAccount?: Address;
  networkId?: number;
  wallet?: Wallet;
}

interface BuyOrdersState {
  buyOrders?: BuyOrder[];
}
