type SortDir = 'asc' | 'desc' | 'none';
type SortField = 'token' | 'sell-volume' | 'end-time';

interface FiltersState {
  sellTokens: TokenId[];
  buyTokens: TokenId[];
  sortBy: SortField;
  sortDir: SortDir;
  onlyMyTokens: boolean;
  onlyMyAuctions: boolean;
}

interface FiltersAction {
  type: string;
  payload?: Partial<FiltersState>;
}
