import { INF, toBigNumber, ZERO } from './decimal';

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
