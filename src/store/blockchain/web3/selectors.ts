import { createSelector } from 'reselect';

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

const getEtherscanUrl = createSelector(
  getNetworkType,
  network => {
    switch (network) {
      case 'main':
        return 'https://etherscan.io';

      case 'ropsten':
      case 'rinkeby':
      case 'kovan':
        return `https://${network}.etherscan.io`;

      default:
        return '';
    }
  },
);

export const getExplorerLink = (hash: TransactionHash) => (state: AppState) =>
  `${getEtherscanUrl(state)}/tx/${hash}`;
