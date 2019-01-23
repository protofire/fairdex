import React, { useCallback, useEffect, useState } from 'react';

import { toBigNumber } from '../contracts/utils';
import Input, { InputProps } from './Input';

interface DecimalInputProps extends InputProps {
  inputRef: React.Ref<HTMLInputElement>;
  onValueChange?: (value: BigNumber) => void;
}

const DecimalInput = React.memo(({ inputRef, onValueChange, ...props }: DecimalInputProps) => {
  const [value, setValue] = useState(props.value ? props.value.toString() : '');

  useEffect(() => {
    if (value !== props.value) {
      const num = toBigNumber(value);

      if (onValueChange && num.toString(10) !== props.value) {
        onValueChange(num);
      }
    }
  });

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(event => {
    const inputValue = event.target.value ? event.target.value.trim() : '';

    if (typeof onValueChange !== 'function') {
      return;
    }

    if (inputValue === '' || event.target.value.match(/^(\d+\.?\d*|\.\d+)$/)) {
      setValue(inputValue || '0');
    }
  }, []);

  return <Input ref={inputRef} {...props} value={value} onChange={handleChange} />;
});

export default React.forwardRef<HTMLInputElement, Omit<DecimalInputProps, 'inputRef'>>((props, ref) => (
  <DecimalInput inputRef={ref} {...props} />
));
