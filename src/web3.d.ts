/* tslint:disable:no-submodule-imports */

import Web3 from 'web3';
import { Provider } from 'web3/providers';

declare global {
  interface Window {
    ethereum: EthereumProvider;
    web3: Web3;
  }

  interface EthereumProvider extends Provider {
    enable: () => Promise<any>;
  }
}
