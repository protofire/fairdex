import 'jest-dom/extend-expect';

import React, { ReactElement } from 'react';
import { cleanup, wait } from 'react-testing-library';
import { BrowserRouter as Router } from 'react-router-dom';

import { renderWithRedux } from './utils';

import AccountInfo from '../pages/main/side/AccountInfo';
import WalletInfo from '../pages/main/side/WalletInfo';

import auctions from '../__mocks__/auctions';
import frt from '../__mocks__/frt';
import tokens from '../__mocks__/tokens';
import buyOrders from '../__mocks__/buyOrders';
import { toBigNumber } from '../contracts/utils';

beforeAll(() => {
  // window.web3.eth.getBalance = jest.fn().mockImplementation(() => Promise.resolve(toBigNumber('20000000000000000000')))
  const web3Mock = {
    eth: {
      getBalance() {
        return Promise.resolve(toBigNumber('20000000000000000000'));
      },
    },
  };

  window.web3 = web3Mock;
});

beforeEach(jest.resetAllMocks);

afterEach(cleanup);

describe('Left Sidebar', () => {
  describe('Account Info', () => {
    test('should show a shorten current account address', () => {
      const { getByText } = renderPage(<AccountInfo />);

      const shortAccount = getByText('0x0313…2A0A');
      expect(shortAccount).toBeDefined();
    });

    test('shorten current account address shoud have the full address as title', () => {
      const { getByTitle } = renderPage(<AccountInfo />);

      const addressWithTitle = getByTitle('0x0313Df45e5B9125333a2437eB91d72685E882A0A');
      expect(addressWithTitle).toBeDefined();
    });

    test('should show MGN balance', () => {
      const { getByTestId } = renderPage(<AccountInfo />);

      const balance = getByTestId('frt-balance');
      const symbol = getByTestId('frt-symbol');

      expect(balance).toBeDefined();
      expect(symbol).toBeDefined();
      expect(balance).toHaveTextContent('1');
      expect(symbol).toHaveTextContent('MGN');
    });

    test('should show LC percentage', () => {
      const { getByTestId } = renderPage(<AccountInfo />);

      const percentage = getByTestId('lc-percentage');

      expect(percentage).toBeDefined();
      expect(percentage).toHaveTextContent('0.5 %');
    });

    test('should show past bids count', () => {
      const { getByTestId } = renderPage(<AccountInfo />);

      const bids = getByTestId('past-bids-count');

      expect(bids).toBeDefined();
      expect(bids).toHaveTextContent('4');
    });

    test('should show to claim count', () => {
      const { getByTestId } = renderPage(<AccountInfo />);

      const claim = getByTestId('to-claim-count');

      expect(claim).toBeDefined();
      expect(claim).toHaveTextContent('3');
    });
  });

  describe('Wallet info', () => {
    test('should show ETH balance', async () => {
      const { getByTestId } = renderPage(
        <Router>
          <WalletInfo />
        </Router>,
      );

      const eth = getByTestId('eht-balance');
      expect(eth).toBeDefined();

      await wait(() => {
        expect(eth).toHaveTextContent('20');
      });
    });

    describe('should show the 3 tokens with the bigest total balance', () => {
      test('should show first token balance with bigest balance', async () => {
        const { getByTestId } = renderPage(
          <Router>
            <WalletInfo />
          </Router>,
        );
        const balance = getByTestId('RDN-balance');

        expect(balance).toBeDefined();
        expect(balance).toHaveTextContent('1995.701');
        expect(balance).toHaveAttribute('title', '1995.701027281609654618');
      });

      test('should show second token balance with bigest balance', async () => {
        const { getByTestId } = renderPage(
          <Router>
            <WalletInfo />
          </Router>,
        );
        const balance = getByTestId('OMG-balance');

        expect(balance).toBeDefined();
        expect(balance).toHaveTextContent('1754.311');
        expect(balance).toHaveAttribute('title', '1754.311859462121882781');
      });

      test('should show third token balance with bigest balance', async () => {
        const { getByTestId } = renderPage(
          <Router>
            <WalletInfo />
          </Router>,
        );
        const balance = getByTestId('MKR-balance');

        expect(balance).toBeDefined();
        expect(balance).toHaveTextContent('1.572');
        expect(balance).toHaveAttribute('title', '1.572987420146104349');
      });

      test('should show third token balance with bigest balance', async () => {
        const newTokens: Map<string, Token> = new Map([
          [
            '0xc778417e063141139fce010982780140aa0cd5ab',
            {
              symbol: 'WETH',
              name: 'Wrapped Ether',
              address: '0xc778417e063141139fce010982780140aa0cd5ab',
              decimals: 18,
              balance: [toBigNumber('1.436597202426861019'), toBigNumber('0.8')],
              priceEth: toBigNumber('1'),
            },
          ],
          [
            '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
            {
              symbol: 'GEN',
              name: 'DAOstack',
              address: '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
              decimals: 18,
              balance: [toBigNumber('0'), toBigNumber('0')],
              priceEth: toBigNumber('0.00050328373937176549'),
            },
          ],
          [
            '0x3615757011112560521536258c1e7325ae3b48ae',
            {
              symbol: 'RDN',
              name: 'Raiden',
              address: '0x3615757011112560521536258c1e7325ae3b48ae',
              decimals: 18,
              balance: [toBigNumber('702.256360915461158047'), toBigNumber('1293.444666366148496571')],
              priceEth: toBigNumber('10.002008601439680864'),
            },
          ],
        ]);

        const { getByTestId, queryByTestId } = renderPage(
          <Router>
            <WalletInfo />
          </Router>,
          newTokens,
        );

        expect(queryByTestId('WETH-balance')).not.toBeNull();
        expect(queryByTestId('RDN-balance')).not.toBeNull();
        expect(queryByTestId('GEN-balance')).toBeNull();
      });
    });
  });
});

function renderPage(Component: ReactElement<any>, overrideTokens?: Map<string, Token>) {
  return renderWithRedux(Component, {
    blockchain: {
      auctions,
      frt,
      tokens: overrideTokens || tokens,
      buyOrders,
      feeRatio: toBigNumber(0.005),
      currentAccount: '0x0313Df45e5B9125333a2437eB91d72685E882A0A',
    },
  });
}
