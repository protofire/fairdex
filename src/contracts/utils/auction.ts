export function getToEndVolume(sellVolume?: BigNumber, buyVolume?: BigNumber) {
  if (!sellVolume || !sellVolume.isFinite() || !buyVolume || !buyVolume.isFinite()) {
    return undefined;
  }

  return sellVolume.minus(buyVolume);
}
