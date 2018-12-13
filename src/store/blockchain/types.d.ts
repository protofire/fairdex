type Address = string;
type TransactionHash = string;

type Network = 'main' | 'morden' | 'ropsten' | 'rinkeby' | 'kovan' | 'private';
type Wallet = 'standard' | 'ledger';

type TokenSymbol = string;

interface Token {
  balance: number;
  symbol: TokenSymbol;
  address: Address;
  name: string;
  decimals: number;
}

type AuctionState = 'running' | 'ended' | 'scheduled';

interface Auction {
  auctionIndex: string;
  sellToken: TokenSymbol;
  buyToken: TokenSymbol;
  sellTokenAddress: Address;
  buyTokenAddress: Address;
  auctionStart: number | null;
  auctionEnd: string;
  sellVolume?: string;
  buyVolume?: string;
  currentPrice: string;
  state: AuctionState;
}

interface Fraction {
  num: string | number;
  den: string | number;
}

interface TokenInfo {
  id: TokenSymbol;
  name: string;
  count: number;
}
