import { format as formatDate } from 'date-fns';
import React from 'react';

interface Props {
  value: Date | string | number;
  format?: string;
  defaultValue?: string;
}

const Timestamp = ({ value, format = 'MM/dd/yyyy HH:mm', defaultValue }: Props) => {
  const formatted = value ? formatDate(value, format) : defaultValue;

  return <span>{formatted}</span>;
};

Timestamp.defaultProps = {
  defaultValue: '-',
};

export default React.memo(Timestamp);
