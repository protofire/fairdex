import Erc20Token from './Erc20Token';
import Weth from './Weth';

const cache = new Map<Address, Erc20Token>();
let weth: Weth;

export function getTokenContract(token: Token) {
  const contract = cache.get(token.address) || new Erc20Token(token);

  if (contract != null && !cache.has(token.address)) {
    cache.set(token.address, contract);
  }

  return contract;
}

export function getWethContract(token: Token) {
  const contract = weth || new Weth(token);

  if (contract != null && !weth) {
    weth = contract;
  }

  return contract;
}
