import 'jest-dom/extend-expect';

import React, { ReactElement } from 'react';
import { cleanup } from 'react-testing-library';

import { renderWithRedux } from './utils';

import EndedAuctions from '../pages/main/auctions/containers/EndedAuctions';
import RunningAuctions from '../pages/main/auctions/containers/RunningAuctions';
import ScheduledAuctions from '../pages/main/auctions/containers/ScheduledAuctions';

import auctions from '../__mocks__/auctions';
import frt from '../__mocks__/frt';
import tokens from '../__mocks__/tokens';

beforeEach(jest.resetAllMocks);

afterEach(cleanup);

describe('Auction lists', () => {
  describe('Running auction list', () => {
    test('should show no auction message', () => {
      const { queryByText } = renderEmptyList(<RunningAuctions />);
      expect(queryByText('No auctions found')).toBeDefined();
    });

    test('should show loading spinner', () => {
      const { getByTestId } = renderLoadingList(<RunningAuctions />);
      expect(getByTestId('auction-list-spinner')).toBeDefined();
    });

    test('should show the right number of auctions', () => {
      const { getAllByTestId } = renderList(<RunningAuctions />, auctions);

      const cards = getAllByTestId(/auction-card-*./);

      expect(cards).not.toBeUndefined();
      expect(cards.length).toEqual(6);
    });
  });

  describe('Scheduled auction list', () => {
    test('should show no auction message', () => {
      const { queryByText } = renderEmptyList(<ScheduledAuctions />);
      expect(queryByText('No auctions found')).toBeDefined();
    });

    test('should show loading spinner', () => {
      const { getByTestId } = renderLoadingList(<ScheduledAuctions />);
      expect(getByTestId('auction-list-spinner')).toBeDefined();
    });

    test('should show the right number of auctions', () => {
      const { getAllByTestId } = renderList(<ScheduledAuctions />, auctions);

      const cards = getAllByTestId(/auction-card-*./);

      expect(cards).not.toBeUndefined();
      expect(cards.length).toEqual(1);
    });
  });

  describe('Ended auction list', () => {
    test('should show no auction message', () => {
      const { queryByText } = renderEmptyList(<EndedAuctions />);
      expect(queryByText('No auctions found')).toBeDefined();
    });

    test('should show loading spinner', () => {
      const { getByTestId } = renderLoadingList(<EndedAuctions />);
      expect(getByTestId('auction-list-spinner')).toBeDefined();
    });

    test('should show the right number of auctions', () => {
      const { getAllByTestId } = renderList(<EndedAuctions />, auctions);

      const cards = getAllByTestId(/auction-card-*./);

      expect(cards).not.toBeUndefined();
      expect(cards.length).toEqual(23);
    });
  });
});

function renderEmptyList(Container: ReactElement<any>) {
  return renderList(Container, []);
}

function renderLoadingList(Container: ReactElement<any>) {
  return renderList(Container);
}

function renderList(Container: ReactElement<any>, auctionList?: Auction[]) {
  return renderWithRedux(Container, {
    blockchain: {
      auctions: auctionList,
      frt,
      tokens,
    },
  });
}
