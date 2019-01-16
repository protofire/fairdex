import 'jest-dom/extend-expect';

import React from 'react';
import { cleanup, waitForElement } from 'react-testing-library';

import { renderWithRedux } from './utils';
import { toBigNumber } from '../contracts/utils';

import TokenView from '../pages/main/wallet-overview/TokenView';

beforeEach(jest.resetAllMocks);

afterEach(cleanup);

const tokenWithBalance: Token = {
  address: '0x1',
  balance: [toBigNumber(1), toBigNumber(2)],
  decimals: 18,
  name: 'Token1',
  symbol: 'TK1',
  priceEth: toBigNumber(1),
};

const tokenWithOutBalance: Token = {
  address: '0x2',
  balance: [toBigNumber(0), toBigNumber(0)],
  decimals: 18,
  name: 'Token2',
  symbol: 'TK2',
  priceEth: toBigNumber(1),
};

describe('Wallet overview', () => {
  describe('deposit button', () => {
    test('should be visible if there is balance in wallet', () => {
      const { getByTestId } = renderWithRedux(<TokenView data={tokenWithBalance} />);

      const depositButton = getByTestId(`${tokenWithBalance.address}-deposit-button`);

      expect(depositButton).toBeVisible();
      expect(depositButton).toBeDisabled(); // FIXME - disabled until implement functionality
    });

    test("should not be visible if there isn't balance in wallet", () => {
      const { queryByTestId } = renderWithRedux(<TokenView data={tokenWithOutBalance} />);

      expect(queryByTestId(`${tokenWithOutBalance.address}-deposit-button`)).toBeNull();
    });
  });

  describe('withdraw button', () => {
    test('should be visible if there is balance in wallet', () => {
      const { getByTestId } = renderWithRedux(<TokenView data={tokenWithBalance} />);

      const withdrawButton = getByTestId(`${tokenWithBalance.address}-withdraw-button`);

      expect(withdrawButton).toBeVisible();
      expect(withdrawButton).toBeDisabled(); // FIXME - disabled until implement functionality
    });

    test("should not be visible if there isn't balance in wallet", () => {
      const { queryByTestId } = renderWithRedux(<TokenView data={tokenWithOutBalance} />);

      expect(queryByTestId(`${tokenWithOutBalance.address}-withdraw-button`)).toBeNull();
    });
  });
});
