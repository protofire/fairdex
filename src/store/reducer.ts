import { combineReducers } from 'redux';

import blockchain from './blockchain';
import filters from './filters';
import termsConditions from './terms-conditions';
import ui from './ui';

const rootReducer = combineReducers<AppState>({
  blockchain,
  filters,
  ui,
  termsConditions,
});

export default rootReducer;
