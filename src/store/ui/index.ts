import { Reducer } from 'redux';

import * as actions from './actions';

const initialState: UiState = {
  sidebarVisible: false,
  filtersVisible: false
};

const uiReducer: Reducer<UiState, UiAction> = (state = initialState, action) => {
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

    case actions.SHOW_INFO_MESSAGE:
      return {
        ...state,
        infoMessage: action.payload && action.payload.infoMessage
      };

    case actions.HIDE_INFO_MESSAGE:
      return {
        ...state,
        infoMessage: undefined
      };

    default:
      return state;
  }
};

export default uiReducer;
