import { abi } from '@gnosis.pm/dx-contracts/build/contracts/Token.json';
import { BigNumber } from 'bignumber.js';

import BaseContract from './BaseContract';
import { timeout } from './utils';

class TokenContract extends BaseContract {
  constructor(token: Token) {
    super({
      jsonInterface: abi,
      address: token.address,
    });
  }

  @timeout()
  async getTokenBalance(owner: Address): Promise<string> {
    const balance = await this.instance.methods.balanceOf(owner).call();
    return new BigNumber(balance).toString(10);
  }
}

export default TokenContract;
