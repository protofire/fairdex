import { Reducer } from 'redux';

const initialState: Auction[] = [];

const auctionReducer: Reducer<Auction[]> = (state = initialState) => {
  return state;
};

export default auctionReducer;
