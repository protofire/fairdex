import { abi } from '@gnosis.pm/dx-contracts/build/contracts/EtherToken.json';

import BaseContract from './BaseContract';
import { toDecimal, ZERO } from './utils';

class Erc20Token extends BaseContract {
  private name!: string;
  private symbol!: string;
  private decimals!: number;

  constructor(address: Address) {
    super({ jsonInterface: abi, address });
  }

  async getAllowance(owner: Address, spender: Address) {
    const [decimals, allowed] = await Promise.all([
      this.decimals || this.contract.methods.decimals().call(),
      this.contract.methods.allowance(owner, spender).call(),
    ]);

    return toDecimal(allowed, decimals) || ZERO;
  }

  async getBalance(account: Address) {
    const [decimals, balance] = await Promise.all([
      this.decimals || this.contract.methods.decimals().call(),
      this.contract.methods.balanceOf(account).call(),
    ]);

    return toDecimal(balance, decimals) || ZERO;
  }

  async getTokenInfo(): Promise<Token> {
    try {
      const [name, symbol, decimals] = await Promise.all([
        this.name || this.contract.methods.name().call(),
        this.symbol || this.contract.methods.symbol().call(),
        this.decimals || this.contract.methods.decimals().call(),
      ]);

      this.name = name;
      this.symbol = symbol;
      this.decimals = Number(decimals) || 18;
    } catch (error) {
      this.name = '';
      this.symbol = '';
      this.decimals = 18;
    }

    return {
      address: this.address,
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
    };
  }

  approve(spender: Address, value: number) {
    return this.contract.methods.approve(spender, value);
  }
}

export default Erc20Token;
