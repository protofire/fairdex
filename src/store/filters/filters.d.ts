type SortDir = 'asc' | 'desc' | 'none';
type ActionSortField = 'buy-token' | 'sell-volume' | 'start-time';
type TokenSortField = 'token-name' | 'w-balance' | 'dx-balance' | 'total-balance';

interface FiltersState {
  sellTokens: TokenSymbol[];
  buyTokens: TokenSymbol[];
  auctionSortBy: AuctionSortField;
  auctionSortDir: SortDir;
  onlyMyTokens: boolean;
  claimableAuctions: boolean;
  hideZeroBalance: boolean;
  tokenSortBy: TokenSortField;
  tokenSortDir: SortDir;
}

interface FiltersAction {
  type: string;
  payload?: Partial<FiltersState>;
}
