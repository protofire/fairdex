import { Action, ActionCreator } from 'redux';

export const HIDE_SIDEBAR = 'sidebar/HIDE';
export const SHOW_SIDEBAR = 'sidebar/SHOW';
export const TOGGLE_SIDEBAR = 'sidebar/TOGGLE_VISIBILITY';

export const hideSidebar: ActionCreator<Action> = () => {
  return {
    type: HIDE_SIDEBAR
  };
};

export const showSidebar: ActionCreator<Action> = () => {
  return {
    type: SHOW_SIDEBAR
  };
};

export const toggleSidebar: ActionCreator<Action> = () => {
  return {
    type: TOGGLE_SIDEBAR
  };
};
