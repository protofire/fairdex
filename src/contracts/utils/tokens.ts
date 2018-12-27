import { ZERO } from './decimal';

export function getDxBalance(token?: Token) {
  if (!token || !token.balance || !token.balance.length) {
    return ZERO;
  }

  return token.balance[0];
}

export function getTotalBalance(token?: Token) {
  if (!token || !token.balance || !token.balance.length) {
    return ZERO;
  }

  return token.balance.reduce((total, balance) => total.plus(balance), ZERO);
}

export function getWalletBalance(token?: Token) {
  if (!token || !token.balance || !token.balance.length) {
    return ZERO;
  }

  return token.balance[1];
}
