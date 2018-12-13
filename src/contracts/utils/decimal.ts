import BigNumber from 'bignumber.js';

const TEN = toBigNumber(10);

export type Decimal = BigNumber.Value;

export interface DecimalFormat {
  decimals?: number;
  prefix?: string;
  postfix?: string;
}

export function formatNumber(value: BigNumber.Value, options: DecimalFormat = {}): string {
  const num = toBigNumber(value);

  if (num.isFinite()) {
    const prefix = options.prefix ? options.prefix + ' ' : '';
    const postfix = options.postfix ? ' ' + options.postfix : '';
    const formatted = toBigNumber(options.decimals != null ? num.toFixed(options.decimals) : num);

    return `${prefix}${formatted.toString(10)}${postfix}`;
  }

  return '';
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

export function toBigNumber(value: Decimal): BigNumber {
  return new BigNumber(value);
}

export function toDecimal(value: Decimal, decimals: number): string {
  try {
    const num = toBigNumber(value);
    const base = TEN.pow(decimals);

    return num.div(base).toString(10);
  } catch {
    return '';
  }
}
