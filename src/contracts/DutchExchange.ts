import { abi } from '@gnosis.pm/dx-contracts/build/contracts/DutchExchange.json';
import { DutchExchangeProxy } from '@gnosis.pm/dx-contracts/networks.json';
import { BlockType } from 'web3/eth/types';

import BaseContract from './BaseContract';
import { getPrice } from './utils';

class DutchExchange extends BaseContract {
  constructor(networkId: string) {
    super({
      jsonInterface: abi,
      address: DutchExchangeProxy[networkId].address
    });
  }

  get methods() {
    return this.instance.methods;
  }

  async getAuctions(params: { fromBlock?: BlockType; toBlock?: BlockType } = {}) {
    const events = await this.instance.getPastEvents('AuctionCleared', params);

    return events.map(result => {
      return {
        block: result.blockNumber,
        data: marshallAuction(result.returnValues)
      };
    });
  }

  getAuctionStart(t1: Address, t2: Address): Promise<number | null> {
    return this.methods
      .getAuctionStart(t1, t2)
      .call()
      .then(auctionStart => parseInt(auctionStart, 10))
      .then(auctionStart => (isNaN(auctionStart) ? null : auctionStart * 1000));
  }

  getCurrentPrice(t1: Address, t2: Address, auctionIndex: number): Promise<string> {
    return this.methods
      .getCurrentAuctionPrice(t1, t2, auctionIndex)
      .call()
      .then((price: Fraction) => getPrice(price));
  }

  getSellVolume(t1: Address, t2: Address): Promise<string> {
    return this.methods.sellVolumesCurrent(t1, t2).call();
  }

  getBuyVolume(t1: Address, t2: Address): Promise<string> {
    return this.methods.buyVolumes(t1, t2).call();
  }

  getLatestAuctionIndex(t1: Address, t2: Address): Promise<number> {
    return this.methods
      .getAuctionIndex(t1, t2)
      .call()
      .then(auctionIndex => parseInt(auctionIndex, 10));
  }

  getRunningTokenPairs(tokens: Address[]): Promise<Array<[Address, Address]>> {
    return this.methods
      .getRunningTokenPairs(tokens)
      .call()
      .then(({ tokens1, tokens2 }) => tokens1.map((_: any, i: number) => [tokens1[i], tokens2[i]]));
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
    sellVolume: data.sellVolume
  };
}

function getTokenSymbol(tokenAddress: Address) {
  return `${tokenAddress}`;
}

export default DutchExchange;
