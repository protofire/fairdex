import React from 'react';
import styled from 'styled-components';

interface Props {
  onClickOutside?: () => void;
}

class Panel extends React.PureComponent<Props> {
  private node = React.createRef<HTMLDivElement>();

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (event: MouseEvent) => {
    if (typeof this.props.onClickOutside === 'function' && this.node.current) {
      if (!this.node.current.contains(event.target as Node)) {
        this.props.onClickOutside();
      }
    }
  };

  render() {
    return <div ref={this.node}>{this.props.children}</div>;
  }
}

export default styled(Panel)``;
