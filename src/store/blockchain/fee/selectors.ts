import { createSelector } from 'reselect';

export const getFrt = (state: AppState) => state.blockchain.frt;

export const getLiqContribPercentage = createSelector(
  (state: AppState) => state.blockchain.feeRatio,
  (feeRatio?: BigNumber) => feeRatio && feeRatio.times(100),
);
