import { Reducer } from 'redux';

const dummyAuctions = buildDummyAuctions();

function buildDummyAuctions() {
  const out: Auction[] = [];
  const tokens = ['ASD', 'QWE', 'ERT', 'RTY', 'YUI', 'IOP', 'DFG', 'FGH', 'HJK'];
  const states = ['running', 'scheduled', ' ended'];
  for (let i = 0; i < 30; i++) {
    out.push({
      state: states[Math.round(Math.random() * (states.length - 1))] as AuctionState,
      auctionIndex: i,
      sellToken: tokens[Math.round(Math.random() * (tokens.length - 1))],
      buyToken: tokens[Math.round(Math.random() * (tokens.length - 1))],
      sellTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
      buyTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
      auctionStart: 'string',
      auctionEnd: 'string',
      sellVolume: 100,
      buyVolume: 200,
      closingPrice: 150,
      priceIncrement: 1
    });
  }
  return out;
}

const initialState: AuctionsState = {
  list: dummyAuctions
};

const auctionReducer: Reducer<AuctionsState> = (state = initialState) => {
  return state;
};

export default auctionReducer;
