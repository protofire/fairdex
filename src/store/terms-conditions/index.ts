import { Reducer } from 'redux';

import { ACCEPT_TERMS_CONDITIONS } from './actions';

export * from './selectors';

const storage = localStorage.getItem('terms-condition');

const initialState: TermsConditionsState = {
  accepted: !!(storage && storage === 'accepted'),
};

const reducer: Reducer<TermsConditionsState> = (state = initialState, action) => {
  switch (action.type) {
    case ACCEPT_TERMS_CONDITIONS:
      return {
        ...state,
        accepted: true,
      };

    default:
      return state;
  }
};

export default reducer;
