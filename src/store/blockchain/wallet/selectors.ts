export const getCurrentAccount = (state: AppState): Address => state.blockchain.currentAccount || '';

export const getNetworkType = (state: AppState): Network | null => {
  const { networkId } = state.blockchain;

  if (!networkId) {
    return null;
  }

  switch (networkId) {
    case 1:
      return 'main';
    case 2:
      return 'morden';
    case 3:
      return 'ropsten';
    case 4:
      return 'rinkeby';
    case 42:
      return 'kovan';
    default:
      return 'private';
  }
};
