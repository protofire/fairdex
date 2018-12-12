import { toBigNumber } from './decimal';

export function getToEndVolume(sellVolume: string, buyVolume: string) {
  return toBigNumber(sellVolume)
    .minus(toBigNumber(buyVolume))
    .toString(10);
}
