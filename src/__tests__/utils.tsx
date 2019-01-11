import React from 'react';

import { Provider } from 'react-redux';
import { render } from 'react-testing-library';
import { createStore, Store } from 'redux';

import reducer from '../store/reducer';

interface RenderOptions {
  initialState?: AppState;
  store?: Store<AppState>;
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
    sortBy: 'start-time',
    sortDir: 'asc',
    onlyMyTokens: false,
    claimableAuctions: false,
  },
  ui: {
    sidebarVisible: false,
    filtersVisible: false,
  },
};

export function renderWithRedux(ui: React.ReactElement<any>, options: RenderOptions = {}) {
  const store = options.store || createStore(reducer, options.initialState || initialState);

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}
