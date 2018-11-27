import { Reducer } from 'redux';

import * as actions from './actions';

const initialState: UiState = {
  sidebarVisible: false,
  filtersVisible: false
};

const uiReducer: Reducer<UiState> = (state = initialState, action) => {
  switch (action.type) {
    case actions.SHOW_SIDEBAR:
      return {
        ...state,
        sidebarVisible: true
      };

    case actions.HIDE_SIDEBAR:
      return {
        ...state,
        sidebarVisible: false
      };

    case actions.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible
      };

    case actions.TOGGLE_FILTERS:
      return {
        ...state,
        filtersVisible: !state.filtersVisible
      };

    default:
      return state;
  }
};

export default uiReducer;
