import { Reducer } from 'redux';

import * as actions from './actions';

const uiReducer: Reducer<UiState> = (state = {}, action) => {
  switch (action.type) {
    case actions.SHOW_SIDEBAR:
      return {
        sidebarVisible: true
      };

    case actions.HIDE_SIDEBAR:
      return {
        sidebarVisible: false
      };

    case actions.TOGGLE_SIDEBAR:
      return {
        sidebarVisible: !state.sidebarVisible
      };

    default:
      return state;
  }
};

export default uiReducer;
