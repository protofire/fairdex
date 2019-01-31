import { toBigNumber } from '../contracts/utils';

const frt: Token = {
  address: '',
  decimals: 18,
  name: 'Magnolia Token',
  symbol: 'MGN',
  balance: [toBigNumber('0'), toBigNumber('1')],
};

export default frt;
