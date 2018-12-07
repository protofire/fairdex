export function getPrice(value?: Fraction): string {
  const { web3 } = window;

  if (value) {
    const num = web3.utils.toBN(value.num || 0);
    const den = web3.utils.toBN(value.den || 0);

    if (num.isZero()) {
      return '0';
    }

    if (!den.isZero()) {
      return num.div(den).toString();
    }
  }

  return '';
}
