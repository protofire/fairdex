interface FiltersState {
  sellTokens: string[];
  bidTokens: string[];
  sortBy: 'token' | 'volume' | 'end-time';
  sortDir: 'asc' | 'desc';
  onlyMyTokens: boolean;
  onlyMyAuctions: boolean;
}
