interface FiltersState {
  sellTokens: TokenId[];
  buyTokens: TokenId[];
  sortBy: 'token' | 'volume' | 'end-time';
  sortDir: 'asc' | 'desc';
  onlyMyTokens: boolean;
  onlyMyAuctions: boolean;
}
