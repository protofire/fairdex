import { abi } from '@gnosis.pm/dx-contracts/build/contracts/TokenFRT.json';

import BaseContract from './BaseContract';
import { timeout, toDecimal, ZERO } from './utils';

class FeeReductionToken extends BaseContract {
  decimals = 18;

  constructor(readonly address: Address) {
    super({
      jsonInterface: abi,
      address,
    });
  }

  @timeout()
  async initInfo(account: Address) {
    const [decimals, name, symbol, balance] = await Promise.all([
      this.instance.methods.decimals().call(),
      this.instance.methods.name().call(),
      this.instance.methods.symbol().call(),
      account ? this.instance.methods.lockedTokenBalances(account).call() : 0,
    ]);

    this.decimals = decimals;
    this.name = name;
    this.symbol = symbol;
    this.balance = [toDecimal(balance, this.decimals) || ZERO];

    return {
      decimals,
      name,
      symbol,
      balance: [balance],
    };
  }

  @timeout()
  async getLockedTokenBalances(account: Address) {
    const balance = await this.instance.methods.lockedTokenBalances(account).call();

    return toDecimal(balance, this.decimals) || ZERO;
  }
}

export default FeeReductionToken;
