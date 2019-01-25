import React, { useCallback, useEffect, useState } from 'react';

import { toBigNumber } from '../contracts/utils';
import Input, { InputProps } from './Input';

interface DecimalInputProps extends InputProps {
  inputRef: React.Ref<HTMLInputElement>;
  onValueChange?: (value: BigNumber) => void;
}

const DecimalInput = ({ inputRef, onValueChange, value, ...props }: DecimalInputProps) => {
  const initialValue = value ? value.toString() : '';

  const [inputValue, setInputValue] = useState(initialValue);
  const [numericValue, setNumericValue] = useState(toBigNumber(initialValue));

  useEffect(() => {
    if (initialValue !== numericValue.toString(10)) {
      setInputValue(initialValue);
      setNumericValue(toBigNumber(initialValue));
    }
  });

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    event => {
      event.preventDefault();

      const newValue = event.target.value ? event.target.value.trim() : '';

      if (newValue === '' || newValue.match(/^(\d+\.?\d*|\.\d+)$/)) {
        const newNumericValue = toBigNumber(newValue);

        setInputValue(newValue);
        setNumericValue(newNumericValue);

        if (onValueChange) {
          onValueChange(newNumericValue);
        }
      }
    },
    [onValueChange],
  );

  return <Input ref={inputRef} {...props} value={inputValue} onChange={handleChange} />;
};

export default React.forwardRef<HTMLInputElement, Omit<DecimalInputProps, 'inputRef'>>((props, ref) => (
  <DecimalInput inputRef={ref} {...props} />
));
