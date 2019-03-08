type Market = [Address, Address];

interface Token {
  address: Address;
  balance?: BigNumber[];
  decimals: number;
  name: string;
  symbol: TokenSymbol;
  priceEth?: BigNumber;
  allowance?: BigNumber;
  tradeable?: boolean;
}

interface TokenWithBalance extends Token {
  totalBalance: BigNumber;
}

type TokenSymbol = string;
