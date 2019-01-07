import React from 'react';

import { toBigNumber } from '../contracts/utils';
import Input, { InputProps } from './Input';

interface Props extends InputProps {
  inputRef: React.Ref<HTMLInputElement>;
  onValueChange?: (value: BigNumber) => void;
}

interface State {
  value: string;
}

class DecimalInput extends React.PureComponent<Props, State> {
  state: State = { value: this.props.value ? this.props.value.toString() : '' };

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    const value = this.props.value ? this.props.value.toString() : '';

    if (value !== prevState.value) {
      this.setState({ value });
    }
  }

  handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const inputValue = event.target.value ? event.target.value.trim() : '';

    if (typeof this.props.onValueChange !== 'function') {
      return;
    }

    if (inputValue === '' || event.target.value.match(/^(\d+\.?\d*|\.\d+)$/)) {
      this.setState({ value: inputValue || '0' });

      const value = toBigNumber(inputValue);

      if (value) {
        this.props.onValueChange(value);
      }
    }
  };

  render() {
    const { inputRef, onValueChange, ...props } = this.props;

    return <Input ref={inputRef} {...props} value={this.state.value} onChange={this.handleChange} />;
  }
}

export default React.forwardRef<HTMLInputElement, Omit<Props, 'inputRef'>>((props, ref) => (
  <DecimalInput inputRef={ref} {...props} />
));
