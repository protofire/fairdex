type Address = string;
type TransactionHash = string;

type Network = 'main' | 'morden' | 'ropsten' | 'rinkeby' | 'kovan' | 'private';
type Wallet = 'standard' | 'ledger';

type TokenSymbol = string;

type TokenType = 'ERC20' | 'FRT';

interface Token {
  address: Address;
  decimals: number;
  name: string;
  symbol: TokenSymbol;
}

interface TokenERC20 extends Token {
  balance?: BigNumber[];
}

interface TokenFRT extends Token {
  balance?: BigNumber;
}

type AuctionState = 'running' | 'ended' | 'scheduled';

interface Auction {
  auctionIndex: string;
  sellToken: TokenSymbol;
  buyToken: TokenSymbol;
  sellTokenAddress: Address;
  buyTokenAddress: Address;
  auctionStart: number | null;
  auctionEnd: number | null;
  sellVolume?: BigNumber;
  buyVolume?: BigNumber;
  currentPrice?: BigNumber;
  closingPrice?: BigNumber;
  buyerBalance?: BigNumber;
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

interface BuyOrder {
  blockNumber: number;
  sellToken: Address;
  buyToken: Address;
  auctionIndex: string;
}
