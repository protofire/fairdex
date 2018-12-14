import { abi } from '@gnosis.pm/dx-contracts/build/contracts/Token.json';

import BaseContract from './BaseContract';
import { timeout, toBigNumber, ZERO } from './utils';

class TokenContract extends BaseContract {
  constructor(token: Token) {
    super({
      jsonInterface: abi,
      address: token.address,
    });
  }

  @timeout()
  async getTokenBalance(owner: Address) {
    const balance = await this.instance.methods.balanceOf(owner).call();

    return toBigNumber(balance) || ZERO;
  }
}

export default TokenContract;
