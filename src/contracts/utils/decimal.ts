import { BigNumber } from 'bignumber.js';

const TEN = new BigNumber(10);

export function fromFraction(value?: Fraction): string {
  if (value) {
    const num = new BigNumber(value.num || 0);
    const den = new BigNumber(value.den || 0);

    if (num.isZero()) {
      return '0';
    }

    if (!den.isZero()) {
      return num.div(den).toString();
    }
  }

  return '';
}

export function toDecimal(value: string, decimals: number) {
  try {
    const num = new BigNumber(value);
    const base = TEN.pow(decimals);

    return num.div(base).toString();
  } catch {
    return '';
  }
}
