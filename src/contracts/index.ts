import Erc20Token from './Erc20Token';

const cache = new Map<Address, Erc20Token>();

export function getTokenContract(token: Token) {
  const contract = cache.get(token.address) || new Erc20Token(token);

  if (contract != null && !cache.has(token.address)) {
    cache.set(token.address, contract);
  }

  return contract;
}
