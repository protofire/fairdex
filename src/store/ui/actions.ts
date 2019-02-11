import { ReactNode } from 'react';
import { ActionCreator } from 'redux';

export const HIDE_SIDEBAR = 'sidebar/HIDE';
export const SHOW_SIDEBAR = 'sidebar/SHOW';
export const TOGGLE_SIDEBAR = 'sidebar/TOGGLE_VISIBILITY';
export const SHOW_FILTERS = 'filters/SHOE';
export const HIDE_FILTERS = 'filters/HIDE';
export const SHOW_NOTIFICATION = 'notification/SHOW';
export const HIDE_NOTIFICATION = 'notification/HIDE';
export const SHOW_AUCTION_DETAILS = 'SHOW_AUCTION_DETAILS';
export const HIDE_AUCTION_DETAILS = 'HIDE_AUCTION_DETAILS';

export const hideSidebar: ActionCreator<UiAction> = () => {
  return {
    type: HIDE_SIDEBAR,
  };
};

export const showSidebar: ActionCreator<UiAction> = () => {
  return {
    type: SHOW_SIDEBAR,
  };
};

export const toggleSidebar: ActionCreator<UiAction> = () => {
  return {
    type: TOGGLE_SIDEBAR,
  };
};

export const showFilters: ActionCreator<UiAction> = () => {
  return {
    type: SHOW_FILTERS,
  };
};

export const hideFilters: ActionCreator<UiAction> = () => {
  return {
    type: HIDE_FILTERS,
  };
};

export const showNotification: ActionCreator<UiAction> = (
  type: InfoMessageType,
  title: string,
  content: ReactNode,
) => {
  return {
    type: SHOW_NOTIFICATION,
    payload: {
      infoMessage: {
        type,
        title,
        content,
      },
    },
  };
};

export const hideNotification: ActionCreator<UiAction> = () => {
  return {
    type: HIDE_NOTIFICATION,
  };
};

export const showAuctionDetail: ActionCreator<UiAction> = (auctionDetail: AuctionDetail) => {
  return {
    type: SHOW_AUCTION_DETAILS,
    payload: {
      auctionDetail,
    },
  };
};

export const hideAuctionDetail: ActionCreator<UiAction> = () => {
  return {
    type: HIDE_AUCTION_DETAILS,
  };
};
