import { abi } from '@gnosis.pm/dx-contracts/build/contracts/DutchExchange.json';
import { DutchExchangeProxy as proxy } from '@gnosis.pm/dx-contracts/networks.json';

import BaseContract from './BaseContract';
import { getTokenContract } from './index';
import { Decimal, timeout, toBigNumber, toDecimal, toFractional, ZERO } from './utils';

type Event = 'AuctionCleared' | 'NewBuyOrder' | 'NewTokenPair';

interface Fraction {
  num: string | number;
  den: string | number;
}

class DutchExchange extends BaseContract<Event> {
  constructor(networkId: number) {
    super({
      jsonInterface: abi,
      address: proxy[networkId].address,
    });
  }

  postBid(sellToken: Address, buyToken: Address, auctionIndex: string, buyAmount: Decimal) {
    const amount = toBigNumber(buyAmount);

    return this.contract.methods.postBuyOrder(sellToken, buyToken, auctionIndex, amount.toString(10));
  }

  postClaim(sellToken: Address, buyToken: Address, auctionIndex: string, accountAddress: Address) {
    return this.contract.methods.claimBuyerFunds(sellToken, buyToken, accountAddress, auctionIndex);
  }

  toggleAllowance(token: Token) {
    return getTokenContract(token).approve(this.address, token.allowance && token.allowance.gt(0) ? 0 : -1);
  }

  async getAvailableMarkets(fromBlock = 0) {
    const markets = await this.contract.getPastEvents('NewTokenPair', { fromBlock });

    return markets.map<[Address, Address]>(log => {
      const { buyToken, sellToken } = log.returnValues;

      return [buyToken, sellToken];
    });
  }

  @timeout()
  async getBuyOrders(account: Address) {
    const buyOrders = await this.contract.getPastEvents('NewBuyOrder', {
      fromBlock: 0,
      filter: { user: account },
    });

    return Object.values(
      buyOrders.reduce<{ [key: string]: BuyOrder }>((all, { blockNumber, returnValues: result }) => {
        const { sellToken, buyToken, auctionIndex } = result;

        all[`${sellToken}-${buyToken}-${auctionIndex}`] = {
          blockNumber,
          sellToken: sellToken.toLowerCase(),
          buyToken: buyToken.toLowerCase(),
          auctionIndex,
        };

        return all;
      }, {}),
    );
  }

  @timeout()
  async getAuctionStart(sellToken: Token, buyToken: Token) {
    const auctionStart: string = await this.contract.methods
      .getAuctionStart(sellToken.address, buyToken.address)
      .call();

    const epoch = parseInt(auctionStart, 10);

    return epoch <= 1 ? 0 : epoch * 1_000;
  }

  @timeout()
  async getAuctionEnd(sellToken: Token, buyToken: Token, auctionIndex: string) {
    const [event] = await this.contract.getPastEvents('AuctionCleared', {
      fromBlock: 0,
      filter: { sellToken: sellToken.address, buyToken: buyToken.address, auctionIndex },
    });

    if (event) {
      const block = await web3.eth.getBlock(event.blockNumber);

      if (block) {
        return block.timestamp * 1_000;
      }
    }

    return 0;
  }

  @timeout()
  async getBalance(token: Token, accountAddress: Address) {
    const balance = await this.contract.methods.balances(token.address, accountAddress).call();

    return toDecimal(balance, token.decimals) || ZERO;
  }

  @timeout()
  async getUnclaimedFunds(sellToken: Token, buyToken: Token, auctionIndex: string, accountAddress: Address) {
    const { unclaimedBuyerFunds } = await this.contract.methods
      .getUnclaimedBuyerFunds(sellToken.address, buyToken.address, accountAddress, auctionIndex)
      .call();

    return toDecimal(unclaimedBuyerFunds, sellToken.decimals) || ZERO;
  }

  @timeout()
  async getCurrentPrice(sellToken: Token, buyToken: Token, auctionIndex: string) {
    const currentPrice: Fraction = await this.contract.methods
      .getCurrentAuctionPrice(sellToken.address, buyToken.address, auctionIndex)
      .call();

    return toFractional(currentPrice);
  }

  @timeout()
  async getClosingPrice(sellToken: Token, buyToken: Token, auctionIndex: string) {
    const closingPrice: Fraction = await this.contract.methods
      .closingPrices(sellToken.address, buyToken.address, auctionIndex)
      .call();

    return toFractional(closingPrice);
  }

  @timeout()
  async getPreviousClosingPrice(sellToken: Token, buyToken: Token, auctionIndex: string) {
    const closingPrice: Fraction = await this.contract.methods
      .getPriceInPastAuction(sellToken.address, buyToken.address, auctionIndex)
      .call();

    return toFractional(closingPrice);
  }

  @timeout()
  async getSellVolume(sellToken: Token, buyToken: Token, auctionIndex?: string) {
    if (auctionIndex) {
      const [event] = await this.contract.getPastEvents('AuctionCleared', {
        fromBlock: 0,
        filter: {
          sellToken: sellToken.address,
          buyToken: buyToken.address,
          auctionIndex,
        },
      });

      if (event) {
        return toDecimal(event.returnValues.sellVolume, sellToken.decimals);
      }
    } else {
      const volume: string = await this.contract.methods
        .sellVolumesCurrent(sellToken.address, buyToken.address)
        .call();

      return toDecimal(volume, sellToken.decimals);
    }
  }

  @timeout()
  async getBuyVolume(sellToken: Token, buyToken: Token, auctionIndex?: string) {
    if (auctionIndex) {
      const [event] = await this.contract.getPastEvents('AuctionCleared', {
        fromBlock: 0,
        filter: {
          sellToken: sellToken.address,
          buyToken: buyToken.address,
          auctionIndex,
        },
      });

      if (event) {
        return toDecimal(event.returnValues.buyVolume, buyToken.decimals);
      }
    } else {
      const volume: string = await this.contract.methods
        .buyVolumes(sellToken.address, buyToken.address)
        .call();

      return toDecimal(volume, buyToken.decimals);
    }
  }

  @timeout()
  async getFeeRatio(accountAddress: Address) {
    const currentFeeRatio: Fraction = await this.contract.methods.getFeeRatio(accountAddress).call();

    return toFractional(currentFeeRatio);
  }

  @timeout()
  async getLatestAuctionIndex(sellToken: Token, buyToken: Token) {
    const auctionIndex: string = await this.contract.methods
      .getAuctionIndex(sellToken.address, buyToken.address)
      .call();

    return auctionIndex;
  }

  @timeout()
  async getRunningTokenPairs(tokens: Address[]): Promise<Array<[Address, Address]>> {
    const { tokens1, tokens2 } = await this.contract.methods.getRunningTokenPairs(tokens).call();

    return tokens1.map((_: void, i: number) => {
      return [tokens1[i].toLowerCase(), tokens2[i].toLowerCase()];
    });
  }

  @timeout()
  async getFrtAddress() {
    const frtAddress: Address = await this.contract.methods.frtToken().call();

    return frtAddress;
  }

  @timeout()
  async getPriceOfTokenInLastAuction(token: Token) {
    const price = await this.contract.methods.getPriceOfTokenInLastAuction(token.address).call();

    return toFractional(price);
  }
}

export default DutchExchange;
