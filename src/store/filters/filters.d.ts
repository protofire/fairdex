type SortDir = 'asc' | 'desc' | 'none';
type AuctionSortField = 'bid-token' | 'sell-volume' | 'end-time';
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
  tokenSearchQuery: string;
}

interface FiltersAction {
  type: string;
  payload?: Partial<FiltersState>;
}
