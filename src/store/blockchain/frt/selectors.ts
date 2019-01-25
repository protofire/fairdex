import { ZERO } from '../../../contracts/utils';

const dummyToken: Token = {
  address: '0x',
  balance: [ZERO, ZERO],
  symbol: '',
  name: '',
  decimals: 18,
};

export const getFrt = (state: AppState): Token => state.blockchain.frt || dummyToken;
