import BigNumber from 'bignumber.js';

export const NAN = new BigNumber(NaN);
export const TEN = new BigNumber(10);
export const ZERO = new BigNumber(0);

export type Decimal = BigNumber.Value;

export interface DecimalFormat {
  decimals?: number;
  prefix?: string;
  postfix?: string;
}

export function formatNumber(value: Decimal, options: DecimalFormat = {}): string {
  const num = toBigNumber(value);

  if (num && num.isFinite()) {
    const prefix = options.prefix ? options.prefix + ' ' : '';
    const postfix = options.postfix ? ' ' + options.postfix : '';
    const formatted = toBigNumber(options.decimals != null ? num.toFixed(options.decimals) : num) || '';

    return `${prefix}${formatted.toString(10)}${postfix}`;
  }

  return '';
}

export function fromFraction(value?: Fraction) {
  if (value) {
    const num = toBigNumber(value.num) || ZERO;
    const den = toBigNumber(value.den) || ZERO;

    if (num.isZero()) {
      return ZERO;
    }

    if (!den.isZero()) {
      return num.div(den);
    }
  }

  return undefined;
}

export function toBigNumber(value: Decimal) {
  try {
    return new BigNumber(value);
  } catch {
    return undefined;
  }
}

export function toDecimal(value: Decimal, decimals: number) {
  try {
    const val = toBigNumber(value) || NAN;
    const base = TEN.pow(decimals);

    return val.div(base);
  } catch {
    return undefined;
  }
}
