import { abi } from '@gnosis.pm/dx-contracts/build/contracts/DutchExchange.json';
import { DutchExchangeProxy } from '@gnosis.pm/dx-contracts/networks.json';
import { BlockType } from 'web3/eth/types';

import BaseContract from './BaseContract';
import { fromFraction, toDecimal } from './utils';

const DEFAULT_TIMEOUT = 6_000; // 6 seconds

class DutchExchange extends BaseContract {
  constructor(networkId: string) {
    super({
      jsonInterface: abi,
      address: DutchExchangeProxy[networkId].address,
    });
  }

  get methods() {
    return this.instance.methods;
  }

  async getClearedAuctions(params: { fromBlock?: BlockType; toBlock?: BlockType } = {}) {
    const events = await this.instance.getPastEvents('AuctionCleared', params);

    return events.map(result => {
      return {
        block: result.blockNumber,
        data: marshallAuction(result.returnValues),
      };
    });
  }

  @timeout()
  getAuctionStart(sellToken: Token, buyToken: Token): Promise<number | null> {
    return this.methods
      .getAuctionStart(sellToken.address, buyToken.address)
      .call()
      .then((auctionStart: string) => parseInt(auctionStart, 10))
      .then((auctionStart: number) => (isNaN(auctionStart) ? null : auctionStart * 1000));
  }

  @timeout()
  getCurrentPrice(sellToken: Token, buyToken: Token, auctionIndex: string): Promise<string> {
    return this.methods
      .getCurrentAuctionPrice(sellToken.address, buyToken.address, auctionIndex)
      .call()
      .then((price: Fraction) => fromFraction(price));
  }

  @timeout()
  getSellVolume(sellToken: Token, buyToken: Token): Promise<string> {
    return this.methods
      .sellVolumesCurrent(sellToken.address, buyToken.address)
      .call()
      .then((sellVolume: string) => toDecimal(sellVolume, sellToken.decimals));
  }

  @timeout()
  getBuyVolume(sellToken: Token, buyToken: Token): Promise<string> {
    return this.methods
      .buyVolumes(sellToken.address, buyToken.address)
      .call()
      .then((buyVolume: string) => toDecimal(buyVolume, buyToken.decimals));
  }

  @timeout()
  getLatestAuctionIndex(sellToken: Token, buyToken: Token): Promise<string> {
    return this.methods.getAuctionIndex(sellToken.address, buyToken.address).call();
  }

  @timeout()
  getRunningTokenPairs(tokens: Address[]): Promise<Array<[Address, Address]>> {
    return this.methods
      .getRunningTokenPairs(tokens)
      .call()
      .then(({ tokens1, tokens2 }) =>
        tokens1.map((_: void, i: number) => {
          return [tokens1[i].toLowerCase(), tokens2[i].toLowerCase()];
        }),
      );
  }
}

function marshallAuction(data: any): Partial<Auction> {
  return {
    auctionIndex: data.auctionIndex,
    buyToken: getTokenSymbol(data.buyToken),
    buyTokenAddress: data.buyToken,
    buyVolume: data.buyVolume,
    sellToken: getTokenSymbol(data.sellToken),
    sellTokenAddress: data.sellToken,
    sellVolume: data.sellVolume,
  };
}

function getTokenSymbol(tokenAddress: Address) {
  return `${tokenAddress}`;
}

function timeout({ ms, secs }: { ms?: number; secs?: number } = {}) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...params: any[]) => Promise<any>>,
  ) => {
    const func = descriptor.value;

    if (typeof func === 'function') {
      const delay = ms || (secs && secs * 1_000) || DEFAULT_TIMEOUT;

      descriptor.value = async function(...args) {
        const result = await Promise.race([
          func.apply(this, args),

          new Promise(resolve => {
            setTimeout(() => resolve(), delay);
          }),
        ]);

        return result;
      };
    }
  };
}

export default DutchExchange;
