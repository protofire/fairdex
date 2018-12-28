import reduceReducers from 'reduce-reducers';
import { AnyAction, Reducer } from 'redux';

import auctions from './auctions';
import buyOrders from './buy-orders';
import frt from './frt';
import tokens from './tokens';
import wallet from './wallet';

export * from './auctions';
export * from './buy-orders';
export * from './tokens';
export * from './frt';
export * from './wallet';

const reducer = reduceReducers<BlockchainState>(wallet, tokens, auctions, buyOrders, frt);

export default reducer as Reducer<BlockchainState, AnyAction>;
