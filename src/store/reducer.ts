import { combineReducers } from 'redux';

import auctions from './auctions';
import filters from './filters';
import tokens from './tokens';
import ui from './ui';
import wallet from './wallet';

const rootReducer = combineReducers<AppState>({
  auctions,
  ui,
  tokens,
  wallet,
  filters
});

export default rootReducer;
