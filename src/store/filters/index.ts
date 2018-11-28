import { Action, Reducer } from 'redux';

import * as actions from './actions';

interface FiltersAction extends Action {
  // FIXME this should be exported and used in ./actions.ts too
  payload: Partial<FiltersState>;
}

const initialState: FiltersState = {
  sellTokens: [],
  bidTokens: [],
  sortBy: 'token',
  sortDir: 'asc',
  onlyMyTokens: false,
  onlyMyAuctions: false
};

const reducer: Reducer<FiltersState, FiltersAction> = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.APPLY_FILTERS:
      return {
        ...state,
        ...payload
      };

    case actions.CLEAR_FILTERS:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
};

export default reducer;
