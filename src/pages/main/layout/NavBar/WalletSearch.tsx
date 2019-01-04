import React from 'react';
import styled from 'styled-components';

import SearchInput from '../SearchInput';

import searchIcon from '../../../../images/search.svg';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  searchText: string;
  onSearch: (value: string) => void;
}

interface State {
  collapsed: boolean;
  searchMode: boolean;
}

class WalletSearch extends React.Component<Props, State> {
  state = {
    collapsed: true,
    searchMode: false,
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
    const { searchText, onSearch, ...props } = this.props;

    return (
      <Container {...props}>
        {this.state.searchMode ? (
          <SearchInput
            autoFocus
            placeholder='Enter token name'
            value={searchText}
            onChange={this.search}
            onClose={this.endSearch}
          />
        ) : (
          <SearchIcon onClick={this.startSearch}>
            <span>Search</span>
          </SearchIcon>
        )}
      </Container>
    );
  }
}

const Container = styled.div`
  ${SearchInput} {
    background-color: #eaedef;
    width: 256px;
  }
`;

const SearchIcon = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  cursor: pointer;
  background: url(${searchIcon}) no-repeat center;

  span {
    padding-left: var(--spacing-normal);
    font-size: 14px;
    line-height: 24px;
    letter-spacing: -0.3px;
    color: var(--color-text-secondary);

    @media (max-width: 800px) {
      display: none;
    }
  }
`;

export default WalletSearch;
