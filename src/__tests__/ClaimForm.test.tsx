import 'jest-dom/extend-expect';

import React from 'react';
import { cleanup, fireEvent, waitForElement } from 'react-testing-library';

import { renderWithRedux } from './utils';
import { toBigNumber } from '../contracts/utils';

import ClaimForm from '../pages/main/auctions/claim/ClaimForm';
import { ClaimProvider } from '../pages/main/auctions/claim/ClaimContext';

beforeEach(jest.clearAllMocks);

afterEach(cleanup);

jest
  .spyOn(dx, 'postClaim')
  .mockImplementation((sellTokenAddress, buyTokenAddress, auctionIndex, currentAccount) => {
    return {
      send() {
        return this;
      },
      once() {
        return this;
      },
    };
  });

describe('in running auctions', () => {
  const data: RunningAuction = {
    auctionIndex: '111',
    state: 'running',
    auctionStart: Date.now(),
    sellToken: 'OMG',
    sellTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    sellVolume: toBigNumber(100),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber(0),
    currentPrice: toBigNumber(0.0123456789),
    closingPrice: toBigNumber(0.0123456789 * 2),
    unclaimedFunds: toBigNumber(1234),
  };

  describe('claim button', () => {
    test('should be visible if there is unclaimed balance', () => {
      const { getByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      const claimButton = getByTestId('claim-button');

      expect(claimButton).toBeVisible();
      expect(claimButton).not.toBeDisabled();
    });

    test('should not be visible if there is no unclaimed balance', () => {
      const { queryByTestId } = renderWithRedux(
        <ClaimForm
          auction={{
            ...data,
            unclaimedFunds: undefined,
          }}
        />,
      );

      expect(queryByTestId('claim-button')).toBeNull();
    });
  });

  describe('claim dialog', () => {
    test('should display cancel button', async () => {
      const { getByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      fireEvent.click(getByTestId('claim-button'));

      const cancelButton = await waitForElement(() => getByTestId('cancel-claim-button'));

      expect(cancelButton).toBeVisible();
      expect(cancelButton).not.toBeDisabled();
    });

    test('should display unclaimed balance', async () => {
      const { getByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      fireEvent.click(getByTestId('claim-button'));

      const unclaimed = await waitForElement(() => getByTestId('unclaimed-balance'));

      expect(unclaimed).toBeVisible();
      expect(unclaimed).toHaveTextContent('1234 OMG');
    });

    test('should display a message', async () => {
      const { getByTestId, queryByText } = renderWithRedux(<ClaimForm auction={data} />);

      fireEvent.click(getByTestId('claim-button'));

      await waitForElement(() => getByTestId('unclaimed-balance'));

      expect(queryByText('You can claim')).toBeDefined();
    });

    test('should display confirm button', async () => {
      const { getByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      fireEvent.click(getByTestId('claim-button'));

      const confirmButton = await waitForElement(() => getByTestId('confirm-claim-button'));

      expect(confirmButton).toBeVisible();
      expect(confirmButton).not.toBeDisabled();
    });

    test('should be able to claim', () => {});
  });

  test('should be able to claim', async () => {
    const { getByTestId } = renderWithRedux(
      <ClaimProvider>
        <ClaimForm auction={data} />
      </ClaimProvider>,
      {
        blockchain: {
          currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        },
      },
    );

    fireEvent.click(getByTestId('claim-button'));

    const confirmButton = await waitForElement(() => getByTestId('confirm-claim-button'));

    expect(dx.postClaim).not.toHaveBeenCalled();

    fireEvent.click(confirmButton);

    expect(dx.postClaim).toHaveBeenCalledWith(
      data.sellTokenAddress,
      data.buyTokenAddress,
      data.auctionIndex,
      '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
    );
  });
});

describe('in scheduled auctions', () => {
  const data: ScheduledAuction = {
    auctionIndex: '111',
    state: 'scheduled',
    auctionStart: Date.now(),
    sellToken: 'OMG',
    sellTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    sellVolume: toBigNumber(100),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber(0),
    closingPrice: toBigNumber(0.0123456789),
  };

  describe('claim button', () => {
    test('should never be visible', () => {
      const { queryByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      expect(queryByTestId('claim-button')).toBeNull();
    });
  });
});

describe('in ended auctions', () => {
  const data: EndedAuction = {
    auctionIndex: '111',
    state: 'ended',
    auctionEnd: Date.now(),
    sellToken: 'OMG',
    sellTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    sellVolume: toBigNumber(100),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber(0),
    closingPrice: toBigNumber(0.5),
    unclaimedFunds: toBigNumber(1234),
    buyerBalance: toBigNumber(700),
  };

  const dataNoClaim: EndedAuction = {
    auctionIndex: '111',
    state: 'ended',
    auctionEnd: Date.now(),
    sellToken: 'OMG',
    sellTokenAddress: '0x00df91984582e6e96288307e9c2f20b38c8fece9',
    sellVolume: toBigNumber(100),
    buyToken: 'WETH',
    buyTokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    buyVolume: toBigNumber(0),
    closingPrice: toBigNumber(0.5),
    unclaimedFunds: toBigNumber(1400),
    buyerBalance: toBigNumber(700),
  };

  describe('claim button', () => {
    test('should be visible if there is unclaimed balance', () => {
      const { getByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      const claimButton = getByTestId('claim-button');

      expect(claimButton).toBeVisible();
      expect(claimButton).not.toBeDisabled();
    });

    test('should not be visible if there is no unclaimed balance', () => {
      const { queryByTestId } = renderWithRedux(
        <ClaimForm
          auction={{
            ...data,
            unclaimedFunds: undefined,
          }}
        />,
      );

      expect(queryByTestId('claim-button')).toBeNull();
    });
  });

  describe('claim dialog', () => {
    test('should display cancel button', async () => {
      const { getByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      fireEvent.click(getByTestId('claim-button'));

      const cancelButton = await waitForElement(() => getByTestId('cancel-claim-button'));

      expect(cancelButton).toBeVisible();
      expect(cancelButton).not.toBeDisabled();
    });

    test('should display unclaimed balance', async () => {
      const { getByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      fireEvent.click(getByTestId('claim-button'));

      const unclaimed = await waitForElement(() => getByTestId('unclaimed-balance'));

      expect(unclaimed).toBeVisible();
      expect(unclaimed).toHaveTextContent('1234 OMG');
    });

    test('should display a message with claimed token', async () => {
      const { getByTestId, queryByText } = renderWithRedux(<ClaimForm auction={dataNoClaim} />);

      fireEvent.click(getByTestId('claim-button'));

      await waitForElement(() => getByTestId('unclaimed-balance'));

      expect(
        queryByText('You bought 1400 OMG with 700 WETH and you have already claimed 166 OMG'),
      ).toBeDefined();
      expect(queryByText('You can claim')).toBeDefined();
    });

    test('should display a message with no claimed token', async () => {
      const { getByTestId, queryByText } = renderWithRedux(<ClaimForm auction={dataNoClaim} />);

      fireEvent.click(getByTestId('claim-button'));

      await waitForElement(() => getByTestId('unclaimed-balance'));

      expect(queryByText('You bought 1400 OMG with 700 WETH')).toBeDefined();
      expect(queryByText('You can claim')).toBeDefined();
    });

    test('should display confirm button', async () => {
      const { getByTestId } = renderWithRedux(<ClaimForm auction={data} />);

      fireEvent.click(getByTestId('claim-button'));

      const confirmButton = await waitForElement(() => getByTestId('confirm-claim-button'));

      expect(confirmButton).toBeVisible();
      expect(confirmButton).not.toBeDisabled();
    });

    test('should be able to claim', async () => {
      const { getByTestId } = renderWithRedux(
        <ClaimProvider>
          <ClaimForm auction={data} />
        </ClaimProvider>,
        {
          blockchain: {
            currentAccount: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          },
        },
      );

      fireEvent.click(getByTestId('claim-button'));

      const confirmButton = await waitForElement(() => getByTestId('confirm-claim-button'));

      expect(dx.postClaim).not.toHaveBeenCalled();

      fireEvent.click(confirmButton);

      expect(dx.postClaim).toHaveBeenCalledWith(
        data.sellTokenAddress,
        data.buyTokenAddress,
        data.auctionIndex,
        '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
      );
    });
  });
});
