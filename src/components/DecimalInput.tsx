import React from 'react';

import { toBigNumber } from '../contracts/utils';
import Input from './Input';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: BigNumber) => void;
}

interface State {
  value: string;
}

class DecimalInput extends React.PureComponent<Props, State> {
  state: State = { value: this.props.value ? this.props.value.toString(10) : '' };

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    const value = this.props.value ? this.props.value.toString(10) : '';

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
    const { onValueChange, ...props } = this.props;

    return <Input {...props} value={this.state.value} onChange={this.handleChange} />;
  }
}

export default DecimalInput;
