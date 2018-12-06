import Web3 from 'web3';
import Contract from 'web3/eth/contract';

export interface ContractOptions {
  jsonInterface: any[];
  address: Address;
  web3?: Web3;
}

abstract class BaseContract {
  protected instance: Contract;

  protected constructor(options: ContractOptions) {
    const web3 = options.web3 || window.web3;
    const { jsonInterface, address } = options;

    this.instance = new web3.eth.Contract(jsonInterface, address);
  }
}

export default BaseContract;
