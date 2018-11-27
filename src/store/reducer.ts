import { combineReducers } from 'redux';

import auctions from './auctions';
import wallet from './wallet';

const rootReducer = combineReducers<AppState>({
  auctions,
  wallet
});

export default rootReducer;
