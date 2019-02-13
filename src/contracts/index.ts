import Erc20Token from './Erc20Token';
import Weth from './Weth';

const cache = new Map<Address, Erc20Token>();
let weth: Weth;

export function getErc20Contract(tokenAddress: Address) {
  const contract = cache.get(tokenAddress) || new Erc20Token(tokenAddress);

  if (contract != null && !cache.has(tokenAddress)) {
    cache.set(tokenAddress, contract);
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
