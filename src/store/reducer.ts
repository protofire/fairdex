import { combineReducers } from 'redux';

import blockchain from './blockchain';
import filters from './filters';
import ui from './ui';
import termsConditions from './terms-conditions';

const rootReducer = combineReducers<AppState>({
  blockchain,
  filters,
  ui,
  termsConditions,
});

export default rootReducer;
