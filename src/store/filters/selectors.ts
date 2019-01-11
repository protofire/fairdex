export function isFiltering({ filters }: AppState) {
  if (!filters) {
    return false;
  }

  return (
    filters.sellTokens.length > 0 ||
    filters.buyTokens.length > 0 ||
    filters.onlyMyTokens ||
    filters.claimableAuctions
  );
}
