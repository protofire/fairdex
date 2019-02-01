import 'jest-dom/extend-expect';

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { cleanup, fireEvent, waitForElement, wait, getByText } from 'react-testing-library';

import { renderWithRedux } from './utils';
import { toBigNumber } from '../contracts/utils';

import BidForm from '../pages/main/auctions/BidForm';
import { getAvailableVolume } from '../contracts/utils/auctions';

import tokens from '../__mocks__/tokens';

beforeEach(jest.clearAllMocks);

afterEach(cleanup);

jest.spyOn(dx, 'postBid').mockImplementation((sellToken, buyToken, auctionIndex, buyAmount) => {
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

  test('bid button should be visible', () => {
    const { getByTestId } = renderWithRedux(<BidForm auction={data} />);

    const bidButton = getByTestId('bid-button');

    expect(bidButton).toBeVisible();
    expect(bidButton).not.toBeDisabled();
  });

  describe('bid dialog', () => {
    test('should display cancel button', async () => {
      const { getByTestId } = renderWithRedux(<BidForm auction={data} />);

      fireEvent.click(getByTestId('bid-button'));

      const cancelButton = await waitForElement(() => getByTestId('cancel-bid-button'));

      expect(cancelButton).toBeVisible();
      expect(cancelButton).not.toBeDisabled();
    });

    test('should show "above previous closing price" dialog', async () => {
      const aboveAuction = { ...data };
      aboveAuction.closingPrice = toBigNumber(1);
      aboveAuction.currentPrice = toBigNumber(1.2);

      const { getByTestId, getByText } = renderWithRedux(<BidForm auction={aboveAuction} />);
      fireEvent.click(getByTestId('bid-button'));

      const proceedButton = await waitForElement(() => getByTestId('cancel-bid-button'));

      expect(proceedButton).toBeVisible();
      expect(getByText('You are bidding above the previous closing price for OMG/WETH')).toBeDefined();
      expect(getByText('1 OMG')).toBeDefined();
    });

    test('should display tooltip when user close the auction with its bid', async () => {
      const { getByTestId, debug } = renderWithRedux(<BidForm auction={data} />, {
        blockchain: {
          tokens,
        },
      });

      const availableSellVolume = getAvailableVolume(data);
      const availableBidVolume = availableSellVolume.times(data.currentPrice);

      const bidAmount = availableBidVolume.plus(1);

      fireEvent.click(getByTestId('bid-button'));

      const bidInput = await waitForElement(() => getByTestId('bid-amount-intput').querySelector('input'));

      fireEvent.change(bidInput, { target: { value: bidAmount.toString() } });

      const message = await waitForElement(() => getByTestId('close-auction-message'));
      expect(getByText(message, '1.2345 WETH')).toBeDefined();
    });

    test('should show the amount the user will buy at least', async () => {
      const { getByTestId, queryByTestId, debug } = renderWithRedux(<BidForm auction={data} />, {
        blockchain: {
          tokens,
        },
      });

      const availableSellVolume = getAvailableVolume(data);
      const availableBidVolume = availableSellVolume.times(data.currentPrice);

      const bidAmount = availableBidVolume.minus(0.01);

      fireEvent.click(getByTestId('bid-button'));

      const bidInput = await waitForElement(() => getByTestId('bid-amount-intput').querySelector('input'));

      fireEvent.change(bidInput, { target: { value: bidAmount.toString() } });

      await wait(() => {
        expect(queryByTestId('close-auction-message')).toBeNull();
      });

      const buiAmount = await waitForElement(() => getByTestId('bid-buy-amount'));
      expect(getByText(buiAmount, 'To buy at least:')).toBeDefined();
      expect(getByText(buiAmount, '99.1899 OMG')).toBeDefined();
    });

    describe('step 3 - bid confirmation', () => {
      test('should show deposit message when user does not have enough balance in DX', async () => {
        const { queryByTestId, getByTestId, debug } = renderWithRedux(
          <Router>
            <BidForm auction={data} />
          </Router>,
          {
            blockchain: {
              tokens,
            },
          },
        );

        fireEvent.click(getByTestId('bid-button'));

        const bidInput = await waitForElement(() => getByTestId('bid-amount-intput').querySelector('input'));

        fireEvent.change(bidInput, { target: { value: '1.2' } });
        fireEvent.click(getByTestId('bid-step2-next-button'));

        await waitForElement(() => getByTestId('bid-confirm-step'));

        const noBalance = queryByTestId('bid-confirm-not-balance-dx');
        expect(noBalance).not.toBeNull();
      });

      test('should show not enough message when user does not have enough total balance', async () => {
        const { queryByTestId, getByTestId, debug } = renderWithRedux(
          <Router>
            <BidForm auction={data} />
          </Router>,
          {
            blockchain: {
              tokens,
            },
          },
        );

        fireEvent.click(getByTestId('bid-button'));

        const bidInput = await waitForElement(() => getByTestId('bid-amount-intput').querySelector('input'));

        fireEvent.change(bidInput, { target: { value: '1.4' } });
        fireEvent.click(getByTestId('bid-step2-next-button'));

        await waitForElement(() => getByTestId('bid-confirm-step'));

        const noBalance = queryByTestId('bid-confirm-not-total-balance');
        expect(noBalance).not.toBeNull();
      });

      test('should show be able to place a bid', async () => {
        const { queryByTestId, getByTestId, debug } = renderWithRedux(
          <Router>
            <BidForm auction={data} />
          </Router>,
          {
            blockchain: {
              tokens,
            },
          },
        );

        fireEvent.click(getByTestId('bid-button'));

        const bidInput = await waitForElement(() => getByTestId('bid-amount-intput').querySelector('input'));

        fireEvent.change(bidInput, { target: { value: '0.9' } });
        fireEvent.click(getByTestId('bid-step2-next-button'));

        await waitForElement(() => getByTestId('bid-confirm-step'));
        const confirButton = getByTestId('confirm-bid-button');

        expect(confirButton).not.toBeDisabled();
        expect(confirButton).toHaveTextContent('Confirm');

        fireEvent.click(confirButton);

        expect(dx.postBid).toHaveBeenCalledWith(
          data.sellTokenAddress,
          data.buyTokenAddress,
          data.auctionIndex,
          '900000000000000000',
        );
      });
    });
  });
});
