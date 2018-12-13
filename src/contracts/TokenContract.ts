import { abi } from '@gnosis.pm/dx-contracts/build/contracts/Token.json';
import { BigNumber } from 'bignumber.js';

import BaseContract from './BaseContract';
import { timeout } from './utils';

class TokenContract extends BaseContract {
  token: Token;

  constructor(token: Token) {
    super({
      jsonInterface: abi,
      address: token.address,
    });
    this.token = token;
  }

  get methods() {
    return this.instance.methods;
  }

  @timeout()
  async getTokenBalance(owner: Address): Promise<BigNumber> {
    const balance = await this.instance.methods.balanceOf(owner).call();
    return new BigNumber(balance);
  }
}

export default TokenContract;
