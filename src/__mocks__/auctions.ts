import { toBigNumber } from '../contracts/utils';

const auctions: Auction[] = [
  {
    auctionIndex: '691',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('2.0000097'),
    buyToken: 'RDN',
    buyTokenAddress: '0x3615757011112560521536258c1e7325ae3b48ae',
    buyVolume: toBigNumber('0'),
    state: 'running',
    auctionStart: 1548324298000,
    currentPrice: toBigNumber('711.10698944462495978373'),
    closingPrice: toBigNumber('497.85884857221086322521'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '395',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('2.0000097'),
    buyToken: 'OMG',
    buyTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    buyVolume: toBigNumber('0'),
    state: 'running',
    auctionStart: 1548317188000,
    currentPrice: toBigNumber('105.43641326989530401721'),
    closingPrice: toBigNumber('92.25686161115839101506'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '395',
    sellToken: 'OMG',
    sellTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    sellVolume: toBigNumber('184.514618113874410267'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'running',
    auctionStart: 1548317188000,
    currentPrice: toBigNumber('0.01238777390536028414'),
    closingPrice: toBigNumber('0.01083930216719024862'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '529',
    sellToken: 'DAI',
    sellTokenAddress: '0x62f25065ba60ca3a2044344955a3b2530e355111',
    sellVolume: toBigNumber('0'),
    buyToken: 'MKR',
    buyTokenAddress: '0x2d9585690a724bfa29a212295a9e8c714ca694aa',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '496',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('0'),
    buyToken: 'MKR',
    buyTokenAddress: '0x2d9585690a724bfa29a212295a9e8c714ca694aa',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '53',
    sellToken: 'RDN',
    sellTokenAddress: '0x7e2331beaec0ded82866f4a1388628322c8d5af0',
    sellVolume: toBigNumber('0'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '135',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('7.05564475'),
    buyToken: 'DAI',
    buyTokenAddress: '0x62f25065ba60ca3a2044344955a3b2530e355111',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '496',
    sellToken: 'MKR',
    sellTokenAddress: '0x2d9585690a724bfa29a212295a9e8c714ca694aa',
    sellVolume: toBigNumber('0.519527963946248673'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'running',
    auctionStart: 1548330913000,
    currentPrice: toBigNumber('6.82120990806633375424'),
    closingPrice: toBigNumber('3.84966708010913675756'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '529',
    sellToken: 'MKR',
    sellTokenAddress: '0x2d9585690a724bfa29a212295a9e8c714ca694aa',
    sellVolume: toBigNumber('0.529974399508413131'),
    buyToken: 'DAI',
    buyTokenAddress: '0x62f25065ba60ca3a2044344955a3b2530e355111',
    buyVolume: toBigNumber('0'),
    state: 'running',
    auctionStart: 1548330553000,
    currentPrice: toBigNumber('729.25076987844504476732'),
    closingPrice: toBigNumber('416.54422043793342164287'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '135',
    sellToken: 'DAI',
    sellTokenAddress: '0x62f25065ba60ca3a2044344955a3b2530e355111',
    sellVolume: toBigNumber('0'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '27',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('2.0000097'),
    buyToken: 'GEN',
    buyTokenAddress: '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '1',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('19.9'),
    buyToken: 'PXT',
    buyTokenAddress: '0x39cd713cb94d0bb176f17c533013d5597058d869',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '53',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('2.1'),
    buyToken: 'RDN',
    buyTokenAddress: '0x7e2331beaec0ded82866f4a1388628322c8d5af0',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '691',
    sellToken: 'RDN',
    sellTokenAddress: '0x3615757011112560521536258c1e7325ae3b48ae',
    sellVolume: toBigNumber('995.722526375252876897'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'running',
    auctionStart: 1548324298000,
    currentPrice: toBigNumber('0.00286894674436710254'),
    closingPrice: toBigNumber('0.002008601439680864'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '1',
    sellToken: 'PXT',
    sellTokenAddress: '0x39cd713cb94d0bb176f17c533013d5597058d869',
    sellVolume: toBigNumber('0'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '27',
    sellToken: 'GEN',
    sellTokenAddress: '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
    sellVolume: toBigNumber('0'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '1',
    sellToken: 'PXT',
    sellTokenAddress: '0x9c591ab22fe4e49caf534c4a209b8afc4ab1efba',
    sellVolume: toBigNumber('0'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '1',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('50.2475'),
    buyToken: 'CWBR',
    buyTokenAddress: '0xf30396d65fbbb29b90d8c2f8bc489bca3446d6b1',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '1',
    sellToken: 'CWBR',
    sellTokenAddress: '0xf30396d65fbbb29b90d8c2f8bc489bca3446d6b1',
    sellVolume: toBigNumber('0'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '394',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('2.0000097'),
    buyToken: 'OMG',
    buyTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    buyVolume: toBigNumber('177.058635815515807515'),
    state: 'ended',
    auctionEnd: 1548316528000,
    closingPrice: toBigNumber('88.52888854264847191241'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '394',
    sellToken: 'OMG',
    sellTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    sellVolume: toBigNumber('184.514618113874410267'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('1.922824308626560726'),
    state: 'ended',
    auctionEnd: 1548316408000,
    closingPrice: toBigNumber('0.01040209487379349715'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '495',
    sellToken: 'MKR',
    sellTokenAddress: '0x2d9585690a724bfa29a212295a9e8c714ca694aa',
    sellVolume: toBigNumber('0.519527963946248673'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('2.040224999088145901'),
    state: 'ended',
    auctionEnd: 1548330208000,
    closingPrice: toBigNumber('3.84966708010913675756'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '528',
    sellToken: 'MKR',
    sellTokenAddress: '0x2d9585690a724bfa29a212295a9e8c714ca694aa',
    sellVolume: toBigNumber('0.529974399508413131'),
    buyToken: 'DAI',
    buyTokenAddress: '0x62f25065ba60ca3a2044344955a3b2530e355111',
    buyVolume: toBigNumber('220.75777309529383325'),
    state: 'ended',
    auctionEnd: 1548329908000,
    closingPrice: toBigNumber('416.54422043793342164287'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '690',
    sellToken: 'RDN',
    sellTokenAddress: '0x3615757011112560521536258c1e7325ae3b48ae',
    sellVolume: toBigNumber('995.722526375252876897'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('1.843425310676156583'),
    state: 'ended',
    auctionEnd: 1548323683000,
    closingPrice: toBigNumber('0.00192676952917534731'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '1',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('20.895'),
    buyToken: 'PXT',
    buyTokenAddress: '0x9c591ab22fe4e49caf534c4a209b8afc4ab1efba',
    buyVolume: toBigNumber('0'),
    state: 'ended',
    auctionEnd: 0,
    closingPrice: toBigNumber('Infinity'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '690',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('2.0000097'),
    buyToken: 'RDN',
    buyTokenAddress: '0x3615757011112560521536258c1e7325ae3b48ae',
    buyVolume: toBigNumber('956.744064488677141344'),
    state: 'ended',
    auctionEnd: 1548321043000,
    closingPrice: toBigNumber('478.36971215123463718401'),
    buyerBalance: toBigNumber('0'),
  },
  {
    auctionIndex: '392',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('2.0000097'),
    buyToken: 'OMG',
    buyTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    buyVolume: toBigNumber('175.878867157546136071'),
    state: 'ended',
    auctionEnd: 1548268828000,
    closingPrice: toBigNumber('87.93900707458875628003'),
    buyerBalance: toBigNumber('0.974210451812633917'),
  },
  {
    auctionIndex: '688',
    sellToken: 'WETH',
    sellTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    sellVolume: toBigNumber('2.0000097'),
    buyToken: 'RDN',
    buyTokenAddress: '0x3615757011112560521536258c1e7325ae3b48ae',
    buyVolume: toBigNumber('906.91111724757946761'),
    state: 'ended',
    auctionEnd: 1548274618000,
    closingPrice: toBigNumber('453.45335937499676507069'),
    buyerBalance: toBigNumber('2.1997852246e-8'),
  },
  {
    auctionIndex: '370',
    sellToken: 'OMG',
    sellTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    sellVolume: toBigNumber('184.514618113874410267'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('1.906977580044616613'),
    state: 'ended',
    auctionEnd: 1547743546000,
    closingPrice: toBigNumber('0.01007126794028916316'),
    buyerBalance: toBigNumber('1.335491738007611174'),
  },
  {
    auctionIndex: '371',
    sellToken: 'OMG',
    sellTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    sellVolume: toBigNumber('184.514618113874410267'),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber('1.906977580044616613'),
    state: 'scheduled',
    auctionStart: 1647743546000,
    closingPrice: toBigNumber('0.01007126794028916316'),
  },
];

export default auctions;