type BlockchainState = AuctionsState & TokensState & WalletState;

interface AuctionsState {
  auctions?: Auction[];
}

interface TokensState {
  feeRatio?: BigNumber;
  tokens?: { [address: string]: Token };
}

interface WalletState {
  currentAccount?: Address;
  networkId?: string;
  wallet?: Wallet;
}
