import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import account from './account';
import auctions from './auctions';
import network from './network';

const composeEnhancers = composeWithDevTools({});

const store = createStore(
  combineReducers<AppState>({
    account,
    auctions,
    network
  }),
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
