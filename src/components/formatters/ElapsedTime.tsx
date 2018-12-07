import { differenceInHours, differenceInMinutes, differenceInWeeks, isBefore, subHours, subWeeks } from 'date-fns';
import React from 'react';

interface Props {
  from: string;
  defaultValue?: string;
}

const ElapsedTime = ({ from, defaultValue }: Props) => {
  const epoch = parseInt(from, 10) * 1000;
  const formatted = elapsedTime(epoch);

  return <span>{formatted || defaultValue}</span>;
};

ElapsedTime.defaultProps = {
  defaultValue: '-'
};

function elapsedTime(epoch: number) {
  const now = Date.now();
  const result: string[] = [];

  if (epoch && isBefore(epoch, now)) {
    const weeks = differenceInWeeks(now, epoch);
    const weeksAgo = subWeeks(now, weeks);

    const hours = differenceInHours(weeksAgo, epoch);
    const hoursAgo = subHours(weeksAgo, hours);

    const minutes = differenceInMinutes(hoursAgo, epoch);

    if (hours > 0) {
      result.push(`${hours}h`);
    }

    if (minutes > 0 || result.length > 0) {
      result.push(`${minutes}m`);
    }
  }

  return result.join(' ');
}

export default ElapsedTime;
