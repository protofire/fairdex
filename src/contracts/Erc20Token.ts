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

  approve(spender: Address, value: number) {
    return this.contract.methods.approve(spender, value);
  }

  @timeout()
  async getBalance(account: Address) {
    const balance = await this.contract.methods.balanceOf(account).call();

    return toDecimal(balance, this.token.decimals) || ZERO;
  }

  @timeout()
  async allowance(owner: Address, spender: Address) {
    const allowed = await this.contract.methods.allowance(owner, spender).call();

    return toDecimal(allowed, this.token.decimals) || ZERO;
  }
}

export default Erc20Token;
