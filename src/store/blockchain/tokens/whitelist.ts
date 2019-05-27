import mainTokens from './whitelist/mainnet.json';

interface TokenStatus {
  address: Address;
  name: string;
  symbol: string;
  etherScanLink?: string;
}

const whitelist: { [network in Network]?: TokenStatus[] } = { main: mainTokens };

class TokenWhitelist {
  readonly whitelist?: TokenStatus[];

  constructor(readonly network?: Network | null) {
    if (network) {
      this.whitelist = whitelist[network];
    }
  }

  isWhitelisted(token: Address) {
    if (!this.whitelist) {
      return true;
    }

    return this.whitelist.some(({ address }) => token.toLowerCase() === address.toLowerCase());
  }

  getTokenData(token: Address) {
    if (!this.whitelist) {
      return undefined;
    }

    return this.whitelist.find(t => t.address.toLowerCase() === token.toLowerCase());
  }
}

export default TokenWhitelist;
