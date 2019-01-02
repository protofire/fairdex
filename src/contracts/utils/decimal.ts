import BigNumber from 'bignumber.js';

export const INF = new BigNumber(Infinity);
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
    const formatted = toBigNumber(options.decimals != null ? num.toFixed(options.decimals) : num);

    return `${prefix}${formatted && formatted.isFinite() ? formatted.toString(10) : '∞'}${postfix}`;
  }

  return '';
}

export function fromDecimal(value: BigNumber, decimals: number) {
  try {
    const base = TEN.pow(decimals);
    const val = toBigNumber(value, NAN).multipliedBy(base);

    return val && val.isFinite() ? val.toString(10) : '';
  } catch {
    return '';
  }
}

export function toBigNumber(value: Decimal, defaultValue = ZERO) {
  try {
    const num = new BigNumber(value);

    return num && num.isFinite() ? num : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function toDecimal(value: Decimal, decimals: number) {
  try {
    const val = toBigNumber(value, NAN);
    const base = TEN.pow(decimals);
    const result = val.div(base);

    return result && result.isFinite() ? result : undefined;
  } catch {
    return undefined;
  }
}
