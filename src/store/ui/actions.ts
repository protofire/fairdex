import { ReactNode } from 'react';
import { ActionCreator } from 'redux';

export const HIDE_SIDEBAR = 'sidebar/HIDE';
export const SHOW_SIDEBAR = 'sidebar/SHOW';
export const TOGGLE_SIDEBAR = 'sidebar/TOGGLE_VISIBILITY';
export const TOGGLE_FILTERS = 'filters/TOGGLE_VISIBILITY';
export const SHOW_INFO_MESSAGE = 'infoMessage/SHOW';
export const HIDE_INFO_MESSAGE = 'infoMessage/HIDE';

export const hideSidebar: ActionCreator<UiAction> = () => {
  return {
    type: HIDE_SIDEBAR
  };
};

export const showSidebar: ActionCreator<UiAction> = () => {
  return {
    type: SHOW_SIDEBAR
  };
};

export const toggleSidebar: ActionCreator<UiAction> = () => {
  return {
    type: TOGGLE_SIDEBAR
  };
};

export const toggleFilters: ActionCreator<UiAction> = () => {
  return {
    type: TOGGLE_FILTERS
  };
};

export const showInfoMessage: ActionCreator<UiAction> = (type: InfoMessageType, title: string, content: ReactNode) => {
  return {
    type: SHOW_INFO_MESSAGE,
    payload: {
      infoMessage: {
        type,
        title,
        content
      }
    }
  };
};

export const hideInfoMessage: ActionCreator<UiAction> = () => {
  return {
    type: HIDE_INFO_MESSAGE
  };
};
