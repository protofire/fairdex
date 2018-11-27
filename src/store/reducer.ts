import { combineReducers } from 'redux';

import auctions from './auctions';
import ui from './ui';
import wallet from './wallet';

const rootReducer = combineReducers<AppState>({
  auctions,
  ui,
  wallet
});

export default rootReducer;
