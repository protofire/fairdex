import { Reducer } from 'redux';

const initialState: AccountInfo = {
  address: null
};

const accountReducer: Reducer<AccountInfo> = (state = initialState) => {
  return state;
};

export default accountReducer;
