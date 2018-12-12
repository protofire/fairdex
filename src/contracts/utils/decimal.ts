import { BigNumber } from 'bignumber.js';

const TEN = new BigNumber(10);

export function toBigNumber(value: string | number | BigNumber): BigNumber {
  return new BigNumber(value);
}

export function fromFraction(value?: Fraction): string {
  if (value) {
    const num = new BigNumber(value.num || 0);
    const den = new BigNumber(value.den || 0);

    if (num.isZero()) {
      return '0';
    }

    if (!den.isZero()) {
      return num.div(den).toString(10);
    }
  }

  return '';
}

export function toDecimal(value: string, decimals: number): string {
  try {
    const num = new BigNumber(value);
    const base = TEN.pow(decimals);

    return num.div(base).toString(10);
  } catch {
    return '';
  }
}
