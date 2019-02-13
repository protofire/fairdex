import { Reducer } from 'redux';

import * as actions from './actions';

const initialState: UiState = {
  sidebarVisible: false,
  filtersVisible: false,
};

const uiReducer: Reducer<UiState, UiAction> = (state = initialState, action) => {
  switch (action.type) {
    case actions.SHOW_SIDEBAR:
      return {
        ...state,
        sidebarVisible: true,
      };

    case actions.HIDE_SIDEBAR:
      return {
        ...state,
        sidebarVisible: false,
      };

    case actions.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible,
      };

    case actions.SHOW_FILTERS:
      return {
        ...state,
        filtersVisible: true,
      };

    case actions.HIDE_FILTERS:
      return {
        ...state,
        filtersVisible: false,
      };

    case actions.SHOW_NOTIFICATION:
      return {
        ...state,
        infoMessage: action.payload && action.payload.infoMessage,
      };

    case actions.HIDE_NOTIFICATION:
      return {
        ...state,
        infoMessage: undefined,
      };

    case actions.SHOW_AUCTION_DETAILS:
      return {
        ...state,
        auctionDetail: action.payload && action.payload.auctionDetail,
      };

    case actions.HIDE_AUCTION_DETAILS:
      return {
        ...state,
        auctionDetail: undefined,
      };

    default:
      return state;
  }
};

export default uiReducer;
