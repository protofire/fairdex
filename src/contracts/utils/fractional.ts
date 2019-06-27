import { fromDecimal, INF, toBigNumber, ZERO } from './decimal';

interface Fraction {
  num: string | number;
  den: string | number;
}

interface Fractional {
  numerator: BigNumber;
  denominator: BigNumber;
  value: BigNumber;
}

export function toFractional({ num, den }: Fraction): Fractional {
  const numerator = toBigNumber(num) || ZERO;
  const denominator = toBigNumber(den) || ZERO;
  const value = numerator.isZero() ? (denominator.isZero() ? INF : ZERO) : numerator.div(denominator);

  return { numerator, denominator, value };
}

export function formatPriceWithDecimals({
  price,
  tokenBDecimals = 18,
  tokenADecimals = 18,
}: {
  price: Fraction;
  tokenADecimals: number;
  tokenBDecimals: number;
}) {
  if (!price) {
    return { den: '1', num: '0' };
  } else {
    const max = Math.max(tokenBDecimals, tokenADecimals);
    const numerator = toBigNumber(price.num) || ZERO;
    const denominator = toBigNumber(price.den) || ZERO;
    return {
      num: fromDecimal(numerator, max - tokenBDecimals),
      den: fromDecimal(denominator, max - tokenADecimals),
    };
  }
}
