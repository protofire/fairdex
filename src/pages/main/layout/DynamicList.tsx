import React from 'react';
import styled from 'styled-components';

import SearchInput from './SearchInput';

import searchIcon from '../../../images/search.svg';

interface Props {
  title: string;
  searchText: string;
  className?: string;
  children: React.ReactNodeArray;
  onSearch: (value: string) => void;
}

interface State {
  collapsed: boolean;
  searchMode: boolean;
}

class DynamicList extends React.Component<Props, State> {
  state = {
    collapsed: true,
    searchMode: false
  };

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  startSearch = () => {
    this.setState({ searchMode: true });
  };

  endSearch = () => {
    this.props.onSearch('');
    this.setState({ searchMode: false });
  };

  search = (e: any) => {
    this.props.onSearch(e.target.value);
  };

  render() {
    const items = this.state.collapsed ? this.props.children.slice(0, 5) : this.props.children;
    return (
      <div className={this.props.className}>
        <Title>
          {this.state.searchMode ? (
            <SearchInput
              autoFocus
              placeholder='Enter token name'
              value={this.props.searchText}
              onChange={this.search}
              onClose={this.endSearch}
            />
          ) : (
            <>
              <Text>{this.props.title}</Text>
              <SearchIcon onClick={this.startSearch} />
            </>
          )}
        </Title>
        <List>{items}</List>
        {this.props.children.length > 5 && (
          <TextButton onClick={this.toggle}>{this.state.collapsed ? 'View all' : 'Collapse'}</TextButton>
        )}
      </div>
    );
  }
}

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Title = styled.h3`
  min-height: 2.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.9em;
  font-weight: bold;

  ${SearchInput} {
    flex: 1 1 auto;
  }
`;

const Text = styled.span`
  flex: 1 1 auto;
`;

const Icon = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const SearchIcon = styled(Icon)`
  background: url(${searchIcon}) no-repeat center;
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

export default DynamicList;
