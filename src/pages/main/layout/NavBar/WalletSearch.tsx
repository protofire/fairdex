import React from 'react';
import styled from 'styled-components';

import SearchInput from '../SearchInput';

import searchIcon from '../../../../images/search.svg';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  searchText: string;
  searchMode: boolean;
  onToggle: (searchMode: boolean) => void;
  onSearch: (value: string) => void;
}

class WalletSearch extends React.Component<Props> {
  toggle = () => {
    this.props.onToggle(!this.props.searchMode);
  };

  endSearch = () => {
    this.props.onSearch('');
    this.props.onToggle(false);
  };

  search = (e: any) => {
    this.props.onSearch(e.target.value);
  };

  render() {
    const { searchText, onSearch, searchMode, ...props } = this.props;

    return (
      <Container {...props}>
        {searchMode ? (
          <SearchInput
            ref={this.inputRef}
            autoFocus
            placeholder='Enter token name'
            value={searchText}
            onChange={this.search}
            onClose={this.endSearch}
          />
        ) : (
          <SearchIcon onClick={this.toggle}>
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
