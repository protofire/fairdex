type SortDir = 'asc' | 'desc' | 'none';
type SortField = 'buy-token' | 'sell-volume' | 'start-time';

interface FiltersState {
  sellTokens: TokenSymbol[];
  buyTokens: TokenSymbol[];
  sortBy: SortField;
  sortDir: SortDir;
  onlyMyTokens: boolean;
  onlyMyAuctions: boolean;
}

interface FiltersAction {
  type: string;
  payload?: Partial<FiltersState>;
}
