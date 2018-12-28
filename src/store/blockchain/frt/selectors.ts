import { BigNumber } from 'bignumber.js';
import { createSelector } from 'reselect';

export const getFrt = (state: AppState) => state.blockchain.frt || { balance: [0], symbol: '' };
