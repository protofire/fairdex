import { abi } from '@gnosis.pm/dx-contracts/build/contracts/DutchExchange.json';
import { DutchExchangeProxy } from '@gnosis.pm/dx-contracts/networks.json';
import { BlockType } from 'web3/eth/types';

import BaseContract from './BaseContract';

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

  async getAuctionStart(t1: Address, t2: Address): Promise<any> {
    const auctionStart = await this.methods.getAuctionStart(t1, t2).call();

    return auctionStart;
  }

  async getCurrentPrice(t1: Address, t2: Address, index: number): Promise<any> {
    const { num, den } = await this.methods.getCurrentAuctionPrice(t1, t2, index).call();

    return num / den;
  }

  async getSellVolume(t1: Address, t2: Address): Promise<any> {
    const sellVolume = await this.methods.sellVolumesCurrent(t1, t2).call();

    return sellVolume;
  }

  async getBuyVolume(t1: Address, t2: Address): Promise<any> {
    const buyVolume = await this.methods.buyVolumes(t1, t2).call();

    return buyVolume;
  }

  async getLatestAuctionIndex(t1: Address, t2: Address): Promise<any> {
    const auctionIndex = await this.methods.getAuctionIndex(t1, t2).call();

    return auctionIndex && parseInt(auctionIndex, 10);
  }

  async getRunningTokenPairs(tokens: Address[]): Promise<Array<[Address, Address]>> {
    const { getRunningTokenPairs } = this.methods;
    const { tokens1, tokens2 } = await getRunningTokenPairs(tokens).call();

    return tokens1.map((_: any, i: number) => [tokens1[i], tokens2[i]]);
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
