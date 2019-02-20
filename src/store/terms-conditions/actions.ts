import { ActionCreator } from 'redux';

export const ACCEPT_TERMS_CONDITIONS = 'ACCEPT_TERMS_CONDITIONS';

export const acceptTermsConditions: ActionCreator<UiAction> = () => {
  localStorage.setItem('terms-condition', 'accepted');

  return {
    type: ACCEPT_TERMS_CONDITIONS,
  };
};
