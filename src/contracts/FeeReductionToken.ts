import { abi } from '@gnosis.pm/dx-contracts/build/contracts/TokenFRT.json';

import BaseContract from './BaseContract';
import { timeout, toDecimal, ZERO } from './utils';

class FeeReductionToken extends BaseContract implements Token {
  name!: string;
  symbol!: TokenSymbol;
  decimals = 18;
  balance!: BigNumber[];

  constructor(readonly address: Address) {
    super({
      jsonInterface: abi,
      address,
    });
  }

  @timeout()
  async initialise(account?: Address) {
    const [decimals, name, symbol, balance] = await Promise.all([
      this.contract.methods.decimals().call(),
      this.contract.methods.name().call(),
      this.contract.methods.symbol().call(),
      account ? this.contract.methods.lockedTokenBalances(account).call() : 0,
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
    const balance = await this.contract.methods.lockedTokenBalances(account).call();

    return toDecimal(balance, this.decimals) || ZERO;
  }
}

export default FeeReductionToken;
