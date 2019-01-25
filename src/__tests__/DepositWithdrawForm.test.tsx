import 'jest-dom/extend-expect';

import React from 'react';
import { cleanup, fireEvent, waitForElement } from 'react-testing-library';

import { renderWithRedux } from './utils';
import { toBigNumber } from '../contracts/utils';

import DespositWithdrawForm from '../pages/main/wallet-overview/DepositWithdrawForm';

beforeEach(jest.clearAllMocks);

afterEach(cleanup);

jest.spyOn(dx, 'depositToken').mockImplementation((token, amount) => {
  return {
    send() {
      return this;
    },
    once() {
      return this;
    },
  };
});

jest.spyOn(dx, 'withdrawToken').mockImplementation((token, amount) => {
  return {
    send() {
      return this;
    },
    once() {
      return this;
    },
  };
});

const tokenNotAllowed: Token = {
  address: '0x1',
  balance: [toBigNumber(100), toBigNumber(200)],
  decimals: 18,
  name: 'Token1',
  symbol: 'TK1',
  priceEth: toBigNumber(1),
  allowance: toBigNumber(0),
};

const token1: Token = {
  address: '0x1',
  balance: [toBigNumber(100), toBigNumber(200)],
  decimals: 18,
  name: 'Token1',
  symbol: 'TK1',
  priceEth: toBigNumber(1),
  allowance: toBigNumber(10),
};

describe('Despoit and Withdraw functionality', () => {
  describe('Deposit', () => {
    describe('Deposit button', () => {
      test('should be disabled when token is not allowed for trading', async () => {
        const { getByTestId } = renderWithRedux(
          <DespositWithdrawForm action={'Deposit'} token={tokenNotAllowed} />,
          {
            blockchain: {
              currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
            },
          },
        );

        const deposit = getByTestId('deposit-0x1-button');
        expect(deposit).toBeVisible();
        expect(deposit).toBeDisabled();
      });

      test('should be enabled when token is allowed for trading', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Deposit'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        const deposit = getByTestId('deposit-0x1-button');
        expect(deposit).toBeVisible();
        expect(deposit).not.toBeDisabled();
      });
    });

    describe('Deposit dialog', () => {
      test('should display cancel button', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Deposit'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('deposit-0x1-button'));

        const cancelButton = await waitForElement(() => getByTestId('cancel-deposit-0x1-button'));

        expect(cancelButton).toBeVisible();
        expect(cancelButton).not.toBeDisabled();
      });

      test('should display max allowed amount', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Deposit'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('deposit-0x1-button'));

        const maxAllowed = await waitForElement(() => getByTestId('deposit-0x1-max-allowed'));

        expect(maxAllowed).toBeVisible();
        expect(maxAllowed).toHaveTextContent('TK1 (max 200)');
      });

      test('confirm button should be disabled when there is no amount', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Deposit'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('deposit-0x1-button'));

        const confirmButton = await waitForElement(() => getByTestId('confirm-deposit-0x1-button'));

        expect(confirmButton).toBeVisible();
        expect(confirmButton).toBeDisabled();
      });

      test('confirm button should be disabled when user enters an amount greater than the max allowed', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Deposit'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('deposit-0x1-button'));

        const dialog = await waitForElement(() => getByTestId('deposit-0x1-dialog'));
        const amountInput = dialog.querySelector('input');

        fireEvent.change(amountInput, { target: { value: '201' } });

        const confirmButton = await waitForElement(() => getByTestId('confirm-deposit-0x1-button'));

        expect(confirmButton).toBeVisible();
        expect(confirmButton).toBeDisabled();
      });

      test('confirm button should be enabled when user enters an amount lower than the max allowed', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Deposit'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('deposit-0x1-button'));

        const dialog = await waitForElement(() => getByTestId('deposit-0x1-dialog'));
        const amountInput = dialog.querySelector('input');

        fireEvent.change(amountInput, { target: { value: '100' } });

        const confirmButton = await waitForElement(() => getByTestId('confirm-deposit-0x1-button'));

        expect(confirmButton).toBeVisible();
        expect(confirmButton).not.toBeDisabled();
      });

      test('confirm button should be enabled when user enters an amount equal to  the max allowed', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Deposit'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('deposit-0x1-button'));

        const dialog = await waitForElement(() => getByTestId('deposit-0x1-dialog'));
        const amountInput = dialog.querySelector('input');

        fireEvent.change(amountInput, { target: { value: '200' } });

        const confirmButton = await waitForElement(() => getByTestId('confirm-deposit-0x1-button'));

        expect(confirmButton).toBeVisible();
        expect(confirmButton).not.toBeDisabled();
      });

      test('should be able to deposit', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Deposit'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('deposit-0x1-button'));

        const dialog = await waitForElement(() => getByTestId('deposit-0x1-dialog'));
        const amountInput = dialog.querySelector('input');

        fireEvent.change(amountInput, { target: { value: '100' } });

        const confirmButton = await waitForElement(() => getByTestId('confirm-deposit-0x1-button'));

        fireEvent.click(confirmButton);

        expect(dx.depositToken).toHaveBeenCalledWith(token1, toBigNumber(100));
      });
    });
  });

  describe('Withdraw', () => {
    describe('Withdraw dialog', () => {
      test('should display cancel button', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Withdraw'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('withdraw-0x1-button'));

        const cancelButton = await waitForElement(() => getByTestId('cancel-withdraw-0x1-button'));

        expect(cancelButton).toBeVisible();
        expect(cancelButton).not.toBeDisabled();
      });

      test('should display max allowed amount', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Withdraw'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('withdraw-0x1-button'));

        const maxAllowed = await waitForElement(() => getByTestId('withdraw-0x1-max-allowed'));

        expect(maxAllowed).toBeVisible();
        expect(maxAllowed).toHaveTextContent('TK1 (max 100)');
      });

      test('confirm button should be disabled when there is no amount', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Withdraw'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('withdraw-0x1-button'));

        const confirmButton = await waitForElement(() => getByTestId('confirm-withdraw-0x1-button'));

        expect(confirmButton).toBeVisible();
        expect(confirmButton).toBeDisabled();
      });

      test('confirm button should be disabled when user enters an amount greater than the max allowed', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Withdraw'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('withdraw-0x1-button'));

        const dialog = await waitForElement(() => getByTestId('withdraw-0x1-dialog'));
        const amountInput = dialog.querySelector('input');

        fireEvent.change(amountInput, { target: { value: '101' } });

        const confirmButton = await waitForElement(() => getByTestId('confirm-withdraw-0x1-button'));

        expect(confirmButton).toBeVisible();
        expect(confirmButton).toBeDisabled();
      });

      test('confirm button should be enabled when user enters an amount lower than the max allowed', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Withdraw'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('withdraw-0x1-button'));

        const dialog = await waitForElement(() => getByTestId('withdraw-0x1-dialog'));
        const amountInput = dialog.querySelector('input');

        fireEvent.change(amountInput, { target: { value: '90' } });

        const confirmButton = await waitForElement(() => getByTestId('confirm-withdraw-0x1-button'));

        expect(confirmButton).toBeVisible();
        expect(confirmButton).not.toBeDisabled();
      });

      test('confirm button should be enabled when user enters an amount equal to  the max allowed', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Withdraw'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('withdraw-0x1-button'));

        const dialog = await waitForElement(() => getByTestId('withdraw-0x1-dialog'));
        const amountInput = dialog.querySelector('input');

        fireEvent.change(amountInput, { target: { value: '100' } });

        const confirmButton = await waitForElement(() => getByTestId('confirm-withdraw-0x1-button'));

        expect(confirmButton).toBeVisible();
        expect(confirmButton).not.toBeDisabled();
      });

      test('should be able to withdraw', async () => {
        const { getByTestId } = renderWithRedux(<DespositWithdrawForm action={'Withdraw'} token={token1} />, {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        });

        fireEvent.click(getByTestId('withdraw-0x1-button'));

        const dialog = await waitForElement(() => getByTestId('withdraw-0x1-dialog'));
        const amountInput = dialog.querySelector('input');

        fireEvent.change(amountInput, { target: { value: '90' } });

        const confirmButton = await waitForElement(() => getByTestId('confirm-withdraw-0x1-button'));

        fireEvent.click(confirmButton);

        expect(dx.withdrawToken).toHaveBeenCalledWith(token1, toBigNumber(90));
      });
    });
  });
});
