interface FiltersState {
  sellTokens: TokenId[];
  buyTokens: TokenId[];
  sortBy: 'token' | 'sell-volume' | 'end-time';
  sortDir: 'asc' | 'desc';
  onlyMyTokens: boolean;
  onlyMyAuctions: boolean;
}

interface FiltersAction {
  type: string;
  payload?: Partial<FiltersState>;
}
