import { abi } from '@gnosis.pm/dx-contracts/build/contracts/DutchExchange.json';
import { DutchExchangeProxy } from '@gnosis.pm/dx-contracts/networks.json';
import { BlockType } from 'web3/eth/types';

import BaseContract from './BaseContract';
import { Decimal, fromFraction, timeout, toBigNumber, toDecimal, ZERO } from './utils';

class DutchExchange extends BaseContract {
  constructor(networkId: number) {
    super({
      jsonInterface: abi,
      address: DutchExchangeProxy[networkId].address,
    });
  }

  postBuyOrder(sellToken: Address, buyToken: Address, auctionIndex: string, buyAmount: Decimal) {
    const amount = toBigNumber(buyAmount);

    return this.methods.postBuyOrder(sellToken, buyToken, auctionIndex, amount.toString(10));
  }

  async getAvailableMarkets(fromBlock = 0) {
    const markets = await this.instance.getPastEvents('NewTokenPair', { fromBlock });

    return markets.map<[Address, Address]>(log => {
      const { buyToken, sellToken } = log.returnValues;

      return [buyToken, sellToken];
    });
  }

  async getBuyOrders(account) {
    const buyOrders = await this.instance.getPastEvents('NewBuyOrder', {
      fromBlock: 0,
      filter: { user: account },
    });

    const uniqBuyOrders = buyOrders.reduce((acc, log) => {
      const {
        blockNumber,
        returnValues: { sellToken, buyToken, auctionIndex },
      } = log;

      acc[`${sellToken}-${buyToken}-${auctionIndex}`] = {
        blockNumber,
        sellToken: sellToken.toLowerCase(),
        buyToken: buyToken.toLowerCase(),
        auctionIndex,
      };

      return acc;
    }, {});

    return Object.values(uniqBuyOrders);
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

  listenEvent(event: string, fromBlock, account: Address, callback: (result: any) => void) {
    this.instance.events[event](
      {
        fromBlock: fromBlock || 0,
        filter: { user: account },
      },
      (error, result) => {
        if (error) {
          // console.error(error);
          // TODO: Handle error
        } else {
          callback(result);
        }
      },
    );
  }

  @timeout()
  async getAuctionStart(sellToken: Token, buyToken: Token) {
    const auctionStart: string = await this.methods
      .getAuctionStart(sellToken.address, buyToken.address)
      .call();

    const epoch = parseInt(auctionStart, 10) * 1_000;

    return isNaN(epoch) ? null : epoch;
  }

  @timeout()
  async getBalance(token: Token, accountAddress: Address) {
    const balance = await this.instance.methods.balances(token.address, accountAddress).call();

    return toDecimal(balance, token.decimals) || ZERO;
  }

  @timeout()
  async getBuyerBalances(sellToken: Token, buyToken: Token, auctionIndex: string, accountAddress: Address) {
    const buyerBalance = await this.instance.methods
      .buyerBalances(sellToken.address, buyToken.address, auctionIndex, accountAddress)
      .call();

    return toDecimal(buyerBalance, buyToken.decimals) || ZERO;
  }

  @timeout()
  async getCurrentPrice(sellToken: Token, buyToken: Token, auctionIndex: string) {
    const currentPrice: Fraction = await this.methods
      .getCurrentAuctionPrice(sellToken.address, buyToken.address, auctionIndex)
      .call();

    return fromFraction(currentPrice);
  }

  @timeout()
  async getPrice(sellToken: Token, buyToken: Token, auctionIndex: string) {
    const currentPrice: Fraction = await this.methods
      .getCurrentAuctionPrice(sellToken.address, buyToken.address, auctionIndex)
      .call();

    return currentPrice;
  }

  @timeout()
  async getClosingPrice(sellToken: Token, buyToken: Token, auctionIndex: string) {
    const closingPrice: Fraction = await this.methods
      .closingPrices(sellToken.address, buyToken.address, auctionIndex)
      .call();

    return fromFraction(closingPrice);
  }

  @timeout()
  async getSellVolume(sellToken: Token, buyToken: Token) {
    const sellVolume: string = await this.methods
      .sellVolumesCurrent(sellToken.address, buyToken.address)
      .call();

    return toDecimal(sellVolume, sellToken.decimals);
  }

  @timeout()
  async getBuyVolume(sellToken: Token, buyToken: Token) {
    const buyVolume: string = await this.methods.buyVolumes(sellToken.address, buyToken.address).call();

    return toDecimal(buyVolume, buyToken.decimals);
  }

  @timeout()
  async getFeeRatio(accountAddress: Address) {
    const currentFeeRatio: Fraction = await this.methods.getFeeRatio(accountAddress).call();

    return fromFraction(currentFeeRatio);
  }

  @timeout()
  async getLatestAuctionIndex(sellToken: Token, buyToken: Token): Promise<string> {
    const auctionIndex: string = await this.methods
      .getAuctionIndex(sellToken.address, buyToken.address)
      .call();

    return auctionIndex ? auctionIndex.toString() : '';
  }

  @timeout()
  async getPreviousClosingPrice(sellToken: Token, buyToken: Token, auctionIndex: string) {
    const closingPrice: Fraction = await this.methods
      .getPriceInPastAuction(sellToken.address, buyToken.address, auctionIndex)
      .call();

    return fromFraction(closingPrice);
  }

  @timeout()
  async getRunningTokenPairs(tokens: Address[]): Promise<Array<[Address, Address]>> {
    const { tokens1, tokens2 } = await this.methods.getRunningTokenPairs(tokens).call();

    const pairs = tokens1.map((_: void, i: number) => {
      return [tokens1[i].toLowerCase(), tokens2[i].toLowerCase()];
    });

    return pairs;
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
