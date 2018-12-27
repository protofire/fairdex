import reduceReducers from 'reduce-reducers';
import { AnyAction, Reducer } from 'redux';

import auctions from './auctions';
import buyOrders from './buy-orders';
import magnolia from './magnolia';
import tokens from './tokens';
import wallet from './wallet';

export * from './auctions';
export * from './buy-orders';
export * from './tokens';
export * from './magnolia';
export * from './wallet';

const reducer = reduceReducers<BlockchainState>(wallet, tokens, auctions, buyOrders, magnolia);

export default reducer as Reducer<BlockchainState, AnyAction>;
