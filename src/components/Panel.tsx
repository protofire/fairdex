import React from 'react';
import styled from 'styled-components';

interface Props {
  onClickOutside?: () => void;
  onEscPress?: () => void;
}

class Panel extends React.PureComponent<Props> {
  private node = React.createRef<HTMLDivElement>();

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (event: MouseEvent) => {
    const { onClickOutside } = this.props;

    if (typeof onClickOutside === 'function' && this.node.current) {
      if (!this.node.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
  };

  handleKeyPress = (event: KeyboardEvent) => {
    const { onEscPress } = this.props;

    if (typeof onEscPress === 'function' && event.key === 'Escape') {
      onEscPress();
    }
  };

  render() {
    return <div ref={this.node}>{this.props.children}</div>;
  }
}

export default styled(Panel)``;
