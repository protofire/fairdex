interface TokensState {
  [address: string]: Token;
}

interface Token {
  symbol: TokenSymbol;
  address: Address;
  name: string;
  decimals: number;
}
