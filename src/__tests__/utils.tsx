import React from 'react';

import { Provider } from 'react-redux';
import { render } from 'react-testing-library';
import { createStore } from 'redux';

import reducer from '../store/reducer';

interface StateOptions {
  blockchain?: Partial<BlockchainState>;
  filters?: Partial<FiltersState>;
  ui?: Partial<UiState>;
}

const initialState: AppState = {
  blockchain: {
    tokens: new Map(),
    frt: {
      name: 'Magnolia Token',
      symbol: 'MNG',
      decimals: 18,
      address: '',
    },
  },
  filters: {
    sellTokens: [],
    buyTokens: [],
    auctionSortBy: 'start-time',
    auctionSortDir: 'asc',
    onlyMyTokens: false,
    claimableAuctions: false,
  },
  ui: {
    sidebarVisible: false,
    filtersVisible: false,
  },
};

export function renderWithRedux(ui: React.ReactElement<any>, state: StateOptions = {}) {
  const store = createStore(reducer, { ...initialState, ...state });

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}
