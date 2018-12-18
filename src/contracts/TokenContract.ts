import { abi } from '@gnosis.pm/dx-contracts/build/contracts/Token.json';

import BaseContract from './BaseContract';
import { timeout, toDecimal, ZERO } from './utils';

class TokenContract extends BaseContract {
  constructor(token: Token) {
    super({
      jsonInterface: abi,
      address: token.address,
    });
  }

  @timeout()
  async getTokenBalance(account: Address, token: Token) {
    const balance = await this.instance.methods.balanceOf(account).call();

    return toDecimal(balance, token.decimals) || ZERO;
  }
}

export default TokenContract;
