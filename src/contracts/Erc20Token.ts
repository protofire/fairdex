import { abi } from '@gnosis.pm/dx-contracts/build/contracts/Token.json';

import BaseContract from './BaseContract';
import { timeout, toDecimal, ZERO } from './utils';

class Erc20Token extends BaseContract {
  constructor(readonly token: Token) {
    super({
      jsonInterface: abi,
      address: token.address,
    });
  }

  @timeout()
  async getBalance(account: Address) {
    const balance = await this.instance.methods.balanceOf(account).call();

    return toDecimal(balance, this.token.decimals) || ZERO;
  }
}

export default Erc20Token;
