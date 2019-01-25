type TokenSymbol = string;

interface Token {
  address: Address;
  balance?: BigNumber[];
  decimals: number;
  name: string;
  symbol: TokenSymbol;
  priceEth?: BigNumber;
  allowance?: BigNumber;
}

interface TokenWithBalance extends Token {
  totalBalance: BigNumber;
}
