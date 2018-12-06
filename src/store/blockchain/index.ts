import reduceReducers from 'reduce-reducers';
import { AnyAction, Reducer } from 'redux';

import auctions from './auctions';
import tokens from './tokens';
import wallet from './wallet';

export * from './auctions';
export * from './tokens';
export * from './wallet';

const reducer = reduceReducers<BlockchainState>(wallet, tokens, auctions);

export default reducer as Reducer<BlockchainState, AnyAction>;
