type BlockchainState = AuctionsState & TokensState & WalletState;

interface AuctionsState {
  auctions?: Auction[];
}

interface TokensState {
  tokens?: { [address: string]: Token };
}

interface WalletState {
  currentAccount?: Address;
  networkId?: string;
  wallet?: Wallet;
}
