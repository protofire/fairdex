import React from 'react';

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  subDays,
  subHours,
  subMonths,
} from 'date-fns';

type Timestamp = Date | string | number;

interface Props {
  from?: Timestamp | null;
  to?: Timestamp | null;
  defaultValue?: string;
  prefix?: string;
  postfix?: string;
}

const Duration = ({ from, to, defaultValue = '-', prefix = '', postfix = '' }: Props) => {
  const now = Date.now();
  const formatted = duration(from || now, to || now);

  return <span>{formatted ? `${prefix} ${formatted} ${postfix}`.trim() : defaultValue}</span>;
};

function duration(from: Timestamp, to: Timestamp) {
  const result: string[] = [];

  if (from && to) {
    const months = differenceInMonths(to, from);
    const monthsAgo = subMonths(to, months);

    const days = differenceInDays(monthsAgo, from);
    const daysAgo = subDays(monthsAgo, days);

    const hours = differenceInHours(daysAgo, from);
    const hoursAgo = subHours(daysAgo, hours);

    const minutes = differenceInMinutes(hoursAgo, from);

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

export default Duration;
