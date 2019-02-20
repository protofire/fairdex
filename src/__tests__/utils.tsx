import React from 'react';

import { Provider } from 'react-redux';
import { render } from 'react-testing-library';
import { createStore } from 'redux';

import reducer from '../store/reducer';

import { toBigNumber } from '../contracts/utils';

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
    feeRatio: toBigNumber(0.005),
    currentAccount: '0x0313Df45e5B9125333a2437eB91d72685E882A0A',
  },
  filters: {
    sellTokens: [],
    buyTokens: [],
    auctionSortBy: 'end-time',
    auctionSortDir: 'asc',
    onlyMyTokens: false,
    claimableAuctions: false,
    hideZeroBalance: false,
    tokenSortBy: 'token-name',
    tokenSortDir: 'asc',
    tokenSearchQuery: '',
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
