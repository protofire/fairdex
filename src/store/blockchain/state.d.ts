type BlockchainState = AuctionsState & TokensState & WalletState & BuyOrdersState & FrtState & OwlState;

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

interface OwlState {
  owlAddress?: Address;
}

interface WalletState {
  currentAccount?: Address;
  networkId?: number;
  wallet?: Wallet;
}

interface BuyOrdersState {
  buyOrders?: BuyOrder[];
}
