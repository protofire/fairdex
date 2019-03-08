import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  subDays,
  subHours,
  subMonths,
} from 'date-fns';

type Timestamp = Date | number;

interface Props {
  from?: Timestamp | null;
  to?: Timestamp | null;
  defaultValue?: string;
  prefix?: string;
  postfix?: string;
}

const TimerContext = React.createContext(Date.now());

export const TimerProvider: FunctionComponent = ({ children }) => {
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(Date.now());
    }, 30_000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <TimerContext.Provider value={tick}>{children}</TimerContext.Provider>;
};

export const Duration = ({ from, to, defaultValue = '-', prefix = '', postfix = '' }: Props) => {
  const now = useContext(TimerContext);
  const formatted = useMemo(() => duration(from || now, to || now), [from, to, now]);

  return <span>{formatted ? `${prefix} ${formatted} ${postfix}`.trim() : defaultValue}</span>;
};

export const TimeTo = ({ to }: Props) => {
  const now = useContext(TimerContext);
  const formatted = useMemo(() => (to > now ? duration(now, to) : duration(to, now)), [to, now]);

  return (
    <span>
      {formatted ? `${to > now ? 'in ' : ''} ${formatted} ${to < now ? ' ago' : ''}`.trim() : 'soon'}
    </span>
  );
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
