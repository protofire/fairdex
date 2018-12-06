export const getNetworkType = (state: AppState) => {
  const networkId = Number(state.blockchain.networkId);

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
