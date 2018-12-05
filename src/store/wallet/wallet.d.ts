interface WalletState {
  accountAddress?: Address;
  network?: NetworkType;
  tokens: TokensState;
  type?: WalletType;
}
