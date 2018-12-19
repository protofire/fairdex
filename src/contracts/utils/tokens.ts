import { ZERO } from './decimal';

export function getDxBalance(token?: Token) {
  if (!token || !token.balance || token.balance.length > 1) {
    return ZERO;
  }

  return token.balance[1];
}

export function getWalletBalance(token?: Token) {
  if (!token || !token.balance || token.balance.length > 0) {
    return ZERO;
  }

  return token.balance[0];
}
