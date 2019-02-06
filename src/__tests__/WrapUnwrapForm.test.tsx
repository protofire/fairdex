import 'jest-dom/extend-expect';

import React from 'react';
import { cleanup, fireEvent, waitForElement, wait } from 'react-testing-library';

import { renderWithRedux } from './utils';
import { toBigNumber } from '../contracts/utils';

import WrapUnwrapForm from '../pages/main/wallet-overview/WrapUnwrapForm';

beforeEach(jest.clearAllMocks);

afterEach(cleanup);

jest.spyOn(dx, 'wrapEther').mockImplementation(token => {
  return {
    send() {
      return this;
    },
    once() {
      return this;
    },
  };
});

jest.spyOn(dx, 'unwrapEther').mockImplementation((token, amount) => {
  return {
    send() {
      return this;
    },
    once() {
      return this;
    },
  };
});

beforeEach(() => {
  const web3Mock = {
    eth: {
      getBalance() {
        return Promise.resolve(toBigNumber('20000000000000000000'));
      },
    },
  };

  window.web3 = web3Mock;
});

const wethWithBalance: Token = {
  address: '0x1',
  balance: [toBigNumber(100), toBigNumber(200)],
  decimals: 18,
  name: 'Wrapped ETH',
  symbol: 'WETH',
  priceEth: toBigNumber(1),
  allowance: toBigNumber(0),
};

const wethNoBalance: Token = {
  address: '0x1',
  balance: [toBigNumber(100), toBigNumber(0)],
  decimals: 18,
  name: 'Wrapped ETH',
  symbol: 'WETH',
  priceEth: toBigNumber(1),
  allowance: toBigNumber(0),
};

describe('Despoit and Withdraw functionality', () => {
  describe('buttons', () => {
    test('should show Wrap button', async () => {
      const { queryByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      await wait(() => {
        const button = queryByTestId('wrap-button');
        expect(queryByTestId('wrap-button')).not.toBeNull();
      });
    });

    test('should show Unwrap button', async () => {
      const { queryByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      await wait(() => {
        expect(queryByTestId('unwrap-button')).not.toBeNull();
      });
    });

    test('should not show Wrap button', async () => {
      const web3Mock = {
        eth: {
          getBalance() {
            return Promise.resolve(toBigNumber('0'));
          },
        },
      };

      window.web3 = web3Mock;

      const { queryByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      await wait(() => {
        expect(queryByTestId('wrap-button')).toBeNull();
      });
    });

    test('should not show Unwrap button', async () => {
      const { queryByTestId, debug } = renderWithRedux(<WrapUnwrapForm token={wethNoBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      await wait(() => {
        expect(queryByTestId('unwrap-button')).toBeNull();
      });
    });
  });

  describe('Wrap dialog', () => {
    test('should display cancel button', async () => {
      const { getByTestId, queryByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('wrap-button'));
      fireEvent.click(button);

      const cancelButton = await waitForElement(() => getByTestId('cancel-button'));

      expect(cancelButton).not.toBeUndefined();
    });

    test('should display max allowed amount', async () => {
      const { getByTestId, debug } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('wrap-button'));
      fireEvent.click(button);

      const maxAllowed = await waitForElement(() => getByTestId('max-allowed'));
      expect(maxAllowed).toHaveTextContent('ETH (max 20)');
    });

    test('confirm button should be disabled when there is no amount', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('wrap-button'));
      fireEvent.click(button);

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      expect(confirmButton).not.toBeUndefined();
      expect(confirmButton).toBeDisabled();
    });

    test('confirm button should be disabled when user enters an amount greater than the max allowed', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('wrap-button'));
      fireEvent.click(button);

      const dialog = await waitForElement(() => getByTestId('wrap-unwrap-dialog'));
      const amountInput = dialog.querySelector('input');

      fireEvent.change(amountInput, { target: { value: '21' } });

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      expect(confirmButton).toBeVisible();
      expect(confirmButton).toBeDisabled();
    });

    test('confirm button should be enabled when user enters an amount lower than the max allowed', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('wrap-button'));
      fireEvent.click(button);

      const dialog = await waitForElement(() => getByTestId('wrap-unwrap-dialog'));
      const amountInput = dialog.querySelector('input');

      fireEvent.change(amountInput, { target: { value: '19' } });

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      expect(confirmButton).toBeVisible();
      expect(confirmButton).not.toBeDisabled();
    });

    test('confirm button should be enabled when user enters an amount equal to  the max allowed', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('wrap-button'));
      fireEvent.click(button);

      const dialog = await waitForElement(() => getByTestId('wrap-unwrap-dialog'));
      const amountInput = dialog.querySelector('input');

      fireEvent.change(amountInput, { target: { value: '20' } });

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      expect(confirmButton).toBeVisible();
      expect(confirmButton).not.toBeDisabled();
    });

    test('should be able to deposit', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('wrap-button'));
      fireEvent.click(button);

      const dialog = await waitForElement(() => getByTestId('wrap-unwrap-dialog'));
      const amountInput = dialog.querySelector('input');

      fireEvent.change(amountInput, { target: { value: '20' } });

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      fireEvent.click(confirmButton);

      expect(dx.wrapEther).toHaveBeenCalledWith(wethWithBalance);
    });
  });

  describe('Unwrap dialog', () => {
    test('should display cancel button', async () => {
      const { getByTestId, queryByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('unwrap-button'));
      fireEvent.click(button);

      const cancelButton = await waitForElement(() => getByTestId('cancel-button'));

      expect(cancelButton).not.toBeUndefined();
    });

    test('should display max allowed amount', async () => {
      const { getByTestId, debug } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('unwrap-button'));
      fireEvent.click(button);

      const maxAllowed = await waitForElement(() => getByTestId('max-allowed'));
      expect(maxAllowed).toHaveTextContent('WETH (max 200)');
    });

    test('confirm button should be disabled when there is no amount', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('unwrap-button'));
      fireEvent.click(button);

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      expect(confirmButton).not.toBeUndefined();
      expect(confirmButton).toBeDisabled();
    });

    test('confirm button should be disabled when user enters an amount greater than the max allowed', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('unwrap-button'));
      fireEvent.click(button);

      const dialog = await waitForElement(() => getByTestId('wrap-unwrap-dialog'));
      const amountInput = dialog.querySelector('input');

      fireEvent.change(amountInput, { target: { value: '201' } });

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      expect(confirmButton).toBeVisible();
      expect(confirmButton).toBeDisabled();
    });

    test('confirm button should be enabled when user enters an amount lower than the max allowed', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('unwrap-button'));
      fireEvent.click(button);

      const dialog = await waitForElement(() => getByTestId('wrap-unwrap-dialog'));
      const amountInput = dialog.querySelector('input');

      fireEvent.change(amountInput, { target: { value: '190' } });

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      expect(confirmButton).toBeVisible();
      expect(confirmButton).not.toBeDisabled();
    });

    test('confirm button should be enabled when user enters an amount equal to  the max allowed', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('unwrap-button'));
      fireEvent.click(button);

      const dialog = await waitForElement(() => getByTestId('wrap-unwrap-dialog'));
      const amountInput = dialog.querySelector('input');

      fireEvent.change(amountInput, { target: { value: '200' } });

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      expect(confirmButton).toBeVisible();
      expect(confirmButton).not.toBeDisabled();
    });

    test('should be able to deposit', async () => {
      const { getByTestId } = renderWithRedux(<WrapUnwrapForm token={wethWithBalance} />, {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      });

      const button = await waitForElement(() => getByTestId('unwrap-button'));
      fireEvent.click(button);

      const dialog = await waitForElement(() => getByTestId('wrap-unwrap-dialog'));
      const amountInput = dialog.querySelector('input');

      fireEvent.change(amountInput, { target: { value: '200' } });

      const confirmButton = await waitForElement(() => getByTestId('confirm-button'));

      fireEvent.click(confirmButton);

      expect(dx.unwrapEther).toHaveBeenCalledWith(wethWithBalance, toBigNumber(200));
    });
  });
});
