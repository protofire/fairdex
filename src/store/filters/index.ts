import { Reducer } from 'redux';

import * as actions from './actions';

export * from './selectors';

const initialState: FiltersState = {
  sellTokens: [],
  buyTokens: [],
  auctionSortBy: 'start-time',
  auctionSortDir: 'asc',
  onlyMyTokens: false,
  claimableAuctions: false,
  hideZeroBalance: false,
  tokenSortBy: 'token-name',
  tokenSortDir: 'asc',
  tokenSearchQuery: '',
};

const reducer: Reducer<FiltersState, FiltersAction> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.APPLY_FILTERS:
      return {
        ...state,
        ...payload,
      };

    case actions.CLEAR_FILTERS:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
