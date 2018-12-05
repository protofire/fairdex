import { Reducer } from 'redux';

const initialState: AuctionsState = {
  list: buildDummyAuctions()
};

const auctionReducer: Reducer<AuctionsState> = (state = initialState) => {
  return state;
};

function buildDummyAuctions() {
  const out: Auction[] = [];
  const tokens = ['ASD', 'QWE', 'ERT', 'RTY', 'YUI', 'IOP', 'DFG', 'FGH', 'HJK'];
  const states = ['running', 'scheduled', 'ended'];

  for (let i = 0; i < 30; i++) {
    out.push({
      auctionIndex: i,
      sellToken: tokens[Math.round(Math.random() * (tokens.length - 1))],
      buyToken: tokens[Math.round(Math.random() * (tokens.length - 1))],
      sellTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
      buyTokenAddress: '0xa1033147c9374b6C02F8A7aDfd42D085cb4872ae',
      auctionStart: '1h 45m',
      auctionEnd: 'string',
      sellVolume: 100,
      buyVolume: 200,
      closingPrice: 150,
      priceIncrement: 1,
      state: states[Math.round(Math.random() * (states.length - 2)) + 1] as AuctionState
    });
  }

  return out;
}

export default auctionReducer;
