import { abi } from '@gnosis.pm/dx-contracts/build/contracts/TokenFRT.json';

import BaseContract from './BaseContract';
import { timeout, toDecimal, ZERO } from './utils';

class MagnoliaToken extends BaseContract {
  decimals = 18;

  constructor(readonly address: Address) {
    super({
      jsonInterface: abi,
      address,
    });
  }

  @timeout()
  async getDecimals() {
    const decimals = await this.instance.methods.decimals().call();
    this.decimals = decimals;

    return decimals;
  }

  @timeout()
  async getName() {
    const name = await this.instance.methods.name().call();

    return name;
  }

  @timeout()
  async getSymbol() {
    const symbol = await this.instance.methods.symbol().call();

    return symbol;
  }

  @timeout()
  async getLockedTokenBalances(account: Address) {
    const balance = await this.instance.methods.lockedTokenBalances(account).call();

    return toDecimal(balance, this.decimals) || ZERO;
  }
}

export default MagnoliaToken;
