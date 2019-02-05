import { abi } from '@gnosis.pm/dx-contracts/build/contracts/EtherToken.json';

import BaseContract from './BaseContract';
import { fromDecimal, timeout, toDecimal, ZERO } from './utils';

class Weth extends BaseContract {
  constructor(readonly token: Token) {
    super({
      jsonInterface: abi,
      address: token.address,
    });
  }

  deposit() {
    return this.contract.methods.deposit();
  }

  withdraw(value: BigNumber) {
    return this.contract.methods.withdraw(fromDecimal(value, 18));
  }
}

export default Weth;
