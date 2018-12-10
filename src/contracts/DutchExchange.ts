import { abi } from '@gnosis.pm/dx-contracts/build/contracts/DutchExchange.json';
import { DutchExchangeProxy } from '@gnosis.pm/dx-contracts/networks.json';
import { BlockType } from 'web3/eth/types';

import BaseContract from './BaseContract';
import { fromFraction, toDecimal } from './utils';

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

  getAuctionStart(sellToken: Token, buyToken: Token): Promise<number | null> {
    return this.methods
      .getAuctionStart(sellToken.address, buyToken.address)
      .call()
      .then((auctionStart: string) => parseInt(auctionStart, 10))
      .then((auctionStart: number) => (isNaN(auctionStart) ? null : auctionStart * 1000));
  }

  getCurrentPrice(sellToken: Token, buyToken: Token, auctionIndex: number): Promise<string> {
    return this.methods
      .getCurrentAuctionPrice(sellToken.address, buyToken.address, auctionIndex)
      .call()
      .then((price: Fraction) => fromFraction(price));
  }

  getSellVolume(sellToken: Token, buyToken: Token): Promise<string> {
    return this.methods
      .sellVolumesCurrent(sellToken.address, buyToken.address)
      .call()
      .then((sellVolume: string) => toDecimal(sellVolume, sellToken.decimals));
  }

  getBuyVolume(sellToken: Token, buyToken: Token): Promise<string> {
    return this.methods
      .buyVolumes(sellToken.address, buyToken.address)
      .call()
      .then((buyVolume: string) => toDecimal(buyVolume, buyToken.decimals));
  }

  getLatestAuctionIndex(sellToken: Token, buyToken: Token): Promise<number> {
    return this.methods
      .getAuctionIndex(sellToken.address, buyToken.address)
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
    sellVolume: data.sellVolume,
  };
}

function getTokenSymbol(tokenAddress: Address) {
  return `${tokenAddress}`;
}

export default DutchExchange;
