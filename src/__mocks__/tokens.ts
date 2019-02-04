import { toBigNumber } from '../contracts/utils';

const rawTokens: Token[] = [
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0xc778417e063141139fce010982780140aa0cd5ab',
    decimals: 18,
    balance: [toBigNumber('1'), toBigNumber('0.2')],
    priceEth: toBigNumber('1'),
  },
  {
    symbol: 'RDN',
    name: 'Raiden network tokens',
    address: '0x7e2331beaec0ded82866f4a1388628322c8d5af0',
    decimals: 18,
    balance: [toBigNumber('0'), toBigNumber('0')],
    priceEth: toBigNumber('0.00325791341502291798'),
  },
  {
    symbol: 'RDN',
    name: 'Raiden',
    address: '0x3615757011112560521536258c1e7325ae3b48ae',
    decimals: 18,
    balance: [toBigNumber('702.256360915461158047'), toBigNumber('1293.444666366148496571')],
    priceEth: toBigNumber('10.002008601439680864'),
  },
  {
    symbol: 'GEN',
    name: 'DAOstack',
    address: '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
    decimals: 18,
    balance: [toBigNumber('0'), toBigNumber('0')],
    priceEth: toBigNumber('0.00050328373937176549'),
  },
  {
    symbol: 'DAI',
    name: 'DAI',
    address: '0x62f25065ba60ca3a2044344955a3b2530e355111',
    decimals: 18,
    balance: [toBigNumber('0'), toBigNumber('0')],
    priceEth: toBigNumber('0.00459921773214932546'),
  },
  {
    symbol: 'MKR',
    name: '',
    address: '0x2d9585690a724bfa29a212295a9e8c714ca694aa',
    decimals: 18,
    balance: [toBigNumber('0.312987420146104349'), toBigNumber('1.26')],
    priceEth: toBigNumber('3.84966708010913675756'),
  },
  {
    symbol: 'CWBR',
    name: 'Crowbar Token Test',
    address: '0xf30396d65fbbb29b90d8c2f8bc489bca3446d6b1',
    decimals: 18,
    balance: [toBigNumber('0'), toBigNumber('0')],
    priceEth: toBigNumber('0.005'),
  },
  {
    symbol: 'PXT',
    name: 'PoolX Token',
    address: '0x39cd713cb94d0bb176f17c533013d5597058d869',
    decimals: 18,
    balance: [toBigNumber('0'), toBigNumber('0')],
    priceEth: toBigNumber('1'),
  },
  {
    symbol: 'PXT',
    name: 'PoolX Token',
    address: '0x9c591ab22fe4e49caf534c4a209b8afc4ab1efba',
    decimals: 18,
    balance: [toBigNumber('0'), toBigNumber('0')],
    priceEth: toBigNumber('0.5'),
  },
  {
    symbol: 'OMG',
    name: 'OmiseGO',
    address: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    decimals: 18,
    balance: [toBigNumber('854.311859462121882881'), toBigNumber('899.9999999999999999')],
    priceEth: toBigNumber('0.01083930216719024862'),
  },
];

const tokens: Map<Address, Token> = new Map(rawTokens.map((token: Token) => [token.address, token]));

export default tokens;
