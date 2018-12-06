type Address = string;
type TransactionHash = string;

type Network = 'main' | 'morden' | 'ropsten' | 'rinkeby' | 'kovan' | 'private';
type Wallet = 'standard' | 'ledger';

type TokenSymbol = string;

interface Token {
  symbol: TokenSymbol;
  address: Address;
  name: string;
  decimals: number;
}

type AuctionState = 'running' | 'ended' | 'scheduled';

interface Auction {
  auctionIndex: number;
  sellToken: TokenSymbol;
  buyToken: TokenSymbol;
  sellTokenAddress: Address;
  buyTokenAddress: Address;
  auctionStart: string;
  auctionEnd: string;
  sellVolume: number;
  buyVolume: number;
  closingPrice: number;
  priceIncrement: number;
  state: AuctionState;
}

interface TokenInfo {
  id: TokenSymbol;
  name: string;
  count: number;
}
