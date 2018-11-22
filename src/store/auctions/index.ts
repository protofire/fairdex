import { Reducer } from 'redux';

const dummyAuctions = [
  {
    auctionIndex: 1,
    sellToken: 'MKR',
    buyToken: 'GNO',
    sellTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
    buyTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
    auctionStart: 'string',
    auctionEnd: 'string',
    sellVolume: 100,
    buyVolume: 200,
    closingPrice: 150,
    priceIncrement: 1
  },
  {
    auctionIndex: 2,
    sellToken: 'RDN',
    buyToken: 'ETH',
    sellTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
    buyTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
    auctionStart: 'string',
    auctionEnd: 'string',
    sellVolume: 100,
    buyVolume: 200,
    closingPrice: 150,
    priceIncrement: 1
  },
  {
    auctionIndex: 3,
    sellToken: 'MKR',
    buyToken: 'ETH',
    sellTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
    buyTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
    auctionStart: 'string',
    auctionEnd: 'string',
    sellVolume: 100,
    buyVolume: 200,
    closingPrice: 150,
    priceIncrement: 1
  },
  {
    auctionIndex: 4,
    sellToken: 'MKR',
    buyToken: 'SAS',
    sellTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
    buyTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
    auctionStart: 'string',
    auctionEnd: 'string',
    sellVolume: 100,
    buyVolume: 200,
    closingPrice: 150,
    priceIncrement: 1
  }
];

const initialState: AuctionsState = {
  ended: dummyAuctions.slice(2, 4),
  running: dummyAuctions,
  scheduled: dummyAuctions.slice(1, 2)
};

const auctionReducer: Reducer<AuctionsState> = (state = initialState) => {
  return state;
};

export default auctionReducer;
