import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  children: React.ReactNodeArray;
}

interface State {
  collapsed: boolean;
}

class CollapsibleList extends React.Component<Props, State> {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const items = this.state.collapsed ? this.props.children.slice(0, 5) : this.props.children;
    return (
      <div className={this.props.className}>
        <ul className='list'>{items}</ul>
        <TextButton onClick={this.toggle}>{this.state.collapsed ? 'View all' : 'Collapse'}</TextButton>
      </div>
    );
  }
}

const List = styled(CollapsibleList)`
  .list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

const TextButton = styled.button`
  display: block;
  margin-top: var(--spacing-text);
  cursor: pointer;
  color: var(--color-text-orange);
  border: 0;
  border-bottom: 1px dashed var(--color-text-orange);
  font-size: 0.8em;
  padding: 0 0 0.1em 0;

  &:focus {
    outline: 0;
  }
`;

export default List;
