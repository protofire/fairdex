type BlockchainState = AuctionsState & TokensState & WalletState;

interface AuctionsState {
  auctions?: Auction[];
}

interface TokensState {
  feeRatio?: BigNumber;
  tokens: Map<Address, Token>;
}

interface WalletState {
  currentAccount?: Address;
  networkId?: string;
  wallet?: Wallet;
}
