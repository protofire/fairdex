import React from 'react';
import styled from 'styled-components';

interface Props {
  onClickOutside?: (() => void) | null;
  onBackspacePress?: (() => void) | null;
  onEscPress?: (() => void) | null;
}

class Panel extends React.PureComponent<Props> {
  private node = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if (this.props.onBackspacePress || this.props.onEscPress) {
      document.addEventListener('keydown', this.handleKeyPress, false);
    }

    if (this.props.onClickOutside) {
      document.addEventListener('mousedown', this.handleClick, false);
    }
  }

  componentWillUnmount() {
    if (this.props.onEscPress) {
      document.removeEventListener('keydown', this.handleKeyPress, false);
    }

    if (this.props.onClickOutside) {
      document.removeEventListener('mousedown', this.handleClick, false);
    }
  }

  handleClick = (event: MouseEvent) => {
    if (event && this.props.onClickOutside && this.node.current) {
      if (!this.node.current.contains(event.target as Node)) {
        event.preventDefault();
        this.props.onClickOutside();
      }
    }
  };

  handleKeyPress = (event: KeyboardEvent) => {
    if (event) {
      if (this.props.onBackspacePress && event.key === 'Backspace') {
        event.preventDefault();
        this.props.onBackspacePress();
      }

      if (this.props.onEscPress && event.key === 'Escape') {
        event.preventDefault();
        this.props.onEscPress();
      }
    }
  };

  render() {
    return <div ref={this.node}>{this.props.children}</div>;
  }
}

export default styled(Panel)``;
