import { combineReducers } from 'redux';

import blockchain from './blockchain';
import filters from './filters';
import ui from './ui';

const rootReducer = combineReducers<AppState>({
  blockchain,
  filters,
  ui,
});

export default rootReducer;
