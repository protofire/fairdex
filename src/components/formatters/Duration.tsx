import React from 'react';

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  max,
  min,
  subDays,
  subHours,
  subMonths,
} from 'date-fns';

type Timestamp = Date | string | number;

interface Props {
  from?: Timestamp | null;
  to?: Timestamp | null;
  defaultValue?: string;
}

const Duration = ({ from, to, defaultValue }: Props) => {
  const now = Date.now();
  const formatted = duration(from || now, to || now);

  return <span>{formatted || defaultValue}</span>;
};

Duration.defaultProps = {
  defaultValue: '-',
  from: Date.now(),
  to: Date.now(),
};

function duration(from: Timestamp, to: Timestamp) {
  const result: string[] = [];

  if (from && to) {
    const earlier = min([from, to]);
    const later = max([from, to]);

    const months = differenceInMonths(later, earlier);
    const monthsAgo = subMonths(later, months);

    const days = differenceInDays(monthsAgo, earlier);
    const daysAgo = subDays(monthsAgo, days);

    const hours = differenceInHours(daysAgo, earlier);
    const hoursAgo = subHours(daysAgo, hours);

    const minutes = differenceInMinutes(hoursAgo, earlier);

    if (months > 0) {
      result.push(`${months}mo`);
    }

    if (days > 0) {
      result.push(`${days}d`);
    }

    if (hours > 0) {
      result.push(`${hours}h`);
    }

    if (minutes > 0 || result.length > 0) {
      result.push(`${minutes}m`);
    }
  }

  return result.join(' ');
}

export default React.memo(Duration);
