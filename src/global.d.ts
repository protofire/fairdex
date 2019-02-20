import { BigNumber as BN } from 'bignumber.js';
import Web3 from 'web3';
import { Provider } from 'web3/providers';

import DutchExchange from './contracts/DutchExchange';

declare global {
  type BigNumber = BN;

  let web3: Web3;
  let dx: DutchExchange;

  interface Window {
    ethereum: EthereumProvider;
    web3: Web3;
    dx: DutchExchange;
  }

  interface EthereumProvider extends Provider {
    enable: () => Promise<any>;
    isMetaMask?: boolean;
    isSafe?: boolean;
  }
}
