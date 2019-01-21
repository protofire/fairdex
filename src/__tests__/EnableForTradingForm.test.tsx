import 'jest-dom/extend-expect';
import React from 'react';
import { cleanup, waitForElement, fireEvent } from 'react-testing-library';

import { renderWithRedux } from './utils';
import { toBigNumber } from '../contracts/utils';
import EnableForTrading from '../pages/main/wallet-overview/EnableForTradingForm';

afterEach(cleanup);

const tokenEnabled: Token = {
  address: '0x1',
  balance: [toBigNumber(1), toBigNumber(2)],
  decimals: 18,
  name: 'Token1',
  symbol: 'TK1',
  priceEth: toBigNumber(1),
  allowance: toBigNumber(1),
};

const tokenDisabled: Token = {
  address: '0x1',
  balance: [toBigNumber(1), toBigNumber(2)],
  decimals: 18,
  name: 'Token1',
  symbol: 'TK1',
  priceEth: toBigNumber(1),
  allowance: toBigNumber(0),
};

const mockTokenContract = {
  approve() {
    return {
      send() {
        return this;
      },
      once() {
        return this;
      },
    };
  },
};

jest.mock('../contracts', () => {
  return {
    getTokenContract() {
      return mockTokenContract;
    },
  };
});

describe('Enable for trading form', () => {
  test('should disable a token for trading', async () => {
    const { getByTestId } = renderWithRedux(<EnableForTrading token={tokenEnabled} enabled={true} />, {
      blockchain: {
        currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
      },
    });

    const spy = jest.spyOn(mockTokenContract, 'approve');

    fireEvent.click(getByTestId('trading-toggle-0x1'));

    expect(spy).toHaveBeenCalledWith(dx.address, 0);
  });

  test('should enable a token for trading', async () => {
    const { getByTestId } = renderWithRedux(<EnableForTrading token={tokenDisabled} enabled={false} />, {
      blockchain: {
        currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
      },
    });

    const spy = jest.spyOn(mockTokenContract, 'approve');

    fireEvent.click(getByTestId('trading-toggle-0x1'));

    expect(spy).toHaveBeenCalledWith(dx.address, -1);
  });
});
