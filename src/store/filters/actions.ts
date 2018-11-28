import { Action, ActionCreator } from 'redux';

export const APPLY_FILTERS = 'filters/apply';
export const CLEAR_FILTERS = 'filters/clear';

export const applyFilters: ActionCreator<Action> = (filters: Partial<FiltersState>) => {
  return {
    type: APPLY_FILTERS,
    payload: filters
  };
};

export const clearFilters: ActionCreator<Action> = () => {
  return {
    type: CLEAR_FILTERS
  };
};
