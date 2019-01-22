import 'jest-dom/extend-expect';

import React from 'react';
import { cleanup, fireEvent, waitForElement } from 'react-testing-library';

import { renderWithRedux } from './utils';
import { toBigNumber } from '../contracts/utils';

import WalletNavBar from '../pages/main/layout/NavBar/Wallet';
import WalletOverview from '../pages/main/wallet-overview';

beforeEach(jest.resetAllMocks);

afterEach(cleanup);

const token1: Token = {
  address: '0x1',
  balance: [toBigNumber(1), toBigNumber(5)],
  decimals: 18,
  name: 'Token1',
  symbol: 'TK1',
  priceEth: toBigNumber(1),
};

const token2: Token = {
  address: '0x2',
  balance: [toBigNumber(3), toBigNumber(1)],
  decimals: 18,
  name: 'Token2',
  symbol: 'TK2',
  priceEth: toBigNumber(1),
};

const token3: Token = {
  address: '0x3',
  balance: [toBigNumber(2), toBigNumber(3)],
  decimals: 18,
  name: 'Token3',
  symbol: 'TK3',
  priceEth: toBigNumber(1),
};

const token4: Token = {
  address: '0x4',
  balance: [toBigNumber(0), toBigNumber(0)],
  decimals: 18,
  name: 'Token4',
  symbol: 'TK4',
  priceEth: toBigNumber(1),
};

const tokens: Map<Address, Token> = new Map([
  [token1.address, token1],
  [token2.address, token2],
  [token3.address, token3],
  [token4.address, token4],
]);

describe('Wallet Overview', () => {
  test('should show all tokens', () => {
    const { getAllByTestId } = renderPage();

    const cards = getAllByTestId(/token-card-title-*./);

    expect(cards.length).not.toBeNull();
    expect(cards.length).toEqual(4);
  });

  test('should hide tokens with zero balance', () => {
    const { getByTestId, getAllByTestId } = renderPage();

    const hideZeroBlance = getByTestId('hide-zero-balance');
    fireEvent.click(hideZeroBlance);

    const cards = getAllByTestId(/token-card-title-*./);

    expect(cards.length).not.toBeNull();
    expect(cards.length).toEqual(3);
  });

  test('should show tokens matching search', () => {
    const { getByTestId, getAllByTestId } = renderPage();

    const searchIcon = getByTestId('wallet-overview-search-icon');
    fireEvent.click(searchIcon);

    const searchInput = getByTestId('wallet-overview-search-input');
    fireEvent.change(searchInput, { target: { value: 'TK1' } });

    const cards = getAllByTestId(/token-card-title-*./);

    expect(cards.length).not.toBeNull();
    expect(cards.length).toEqual(1);
    expect(getByTestId(`token-card-title-0x1`).textContent).toEqual('TK1');
  });

  describe('sorting', () => {
    it('should be initially sorted by name asc', async () => {
      const { getByTestId, getAllByTestId } = renderPage();
      const tokenTitles = ['TK1', 'TK2', 'TK3', 'TK4'];

      let cards = getAllByTestId(/token-card-title-*./);
      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));

      await sortBy(getByTestId, 'token-name');
      tokenTitles.reverse();

      cards = getAllByTestId(/token-card-title-*./);

      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));
    });

    it('should sort tokens by name', async () => {
      const { getByTestId, getAllByTestId } = renderPage();
      await sortBy(getByTestId, 'token-name');

      const tokenTitles = ['TK1', 'TK2', 'TK3', 'TK4'];
      tokenTitles.reverse();

      let cards = getAllByTestId(/token-card-title-*./);
      expect(cards.length).not.toBeNull();

      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));
    });

    it('should sort tokens by wallet balance', async () => {
      const { getByTestId, getAllByTestId } = renderPage();
      await sortBy(getByTestId, 'w-balance');

      let cards = getAllByTestId(/token-card-title-*./);
      expect(cards.length).not.toBeNull();

      const tokenTitles = ['TK1', 'TK3', 'TK2', 'TK4'];

      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));

      await sortBy(getByTestId, 'w-balance');
      tokenTitles.reverse();
      cards = getAllByTestId(/token-card-title-*./);

      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));
    });

    it('should sort tokens by dx balance', async () => {
      const { getByTestId, getAllByTestId } = renderPage();
      await sortBy(getByTestId, 'dx-balance');

      let cards = getAllByTestId(/token-card-title-*./);
      expect(cards.length).not.toBeNull();

      const tokenTitles = ['TK2', 'TK3', 'TK1', 'TK4'];

      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));

      await sortBy(getByTestId, 'dx-balance');
      tokenTitles.reverse();
      cards = getAllByTestId(/token-card-title-*./);

      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));
    });

    it('should sort tokens by total balance', async () => {
      const { getByTestId, getAllByTestId } = renderPage();
      await sortBy(getByTestId, 'total-balance');

      let cards = getAllByTestId(/token-card-title-*./);
      expect(cards.length).not.toBeNull();

      const tokenTitles = ['TK1', 'TK3', 'TK2', 'TK4'];

      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));

      await sortBy(getByTestId, 'total-balance');
      tokenTitles.reverse();
      cards = getAllByTestId(/token-card-title-*./);

      expect(cards.map(title => title.textContent).join('')).toEqual(tokenTitles.join(''));
    });
  });
});

function renderPage() {
  return renderWithRedux(
    <>
      <WalletNavBar />
      <WalletOverview />
    </>,
    {
      blockchain: {
        tokens: tokens,
      },
    },
  );
}

async function sortBy(getByTestId: any, sortItem: string) {
  fireEvent.click(getByTestId('wallet-overview-sort'));

  const item = await waitForElement(() => getByTestId(`wallet-overview-sort-item-${sortItem}`));

  fireEvent.click(item);

  return item;
}
