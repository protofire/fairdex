import React from 'react';
import styled from 'styled-components';

import SortIcon from '../../../../components/SortIcon';
import SearchInput from '../SearchInput';

import ic_arrow_up from '../../../../images/ic_arrow_up.svg';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  sortBy: TokenSortField;
  sortDir: SortDir;
  onSelectedItem: (tokenSortBy: TokenSortField, tokenSortDir: SortDir) => void;
}

interface State {
  open: boolean;
}

class WalletSort extends React.Component<Props, State> {
  state = {
    open: false,
  };

  items = {
    'token-name': 'Token name',
    'w-balance': 'Wallet balance',
    'dx-balance': 'DX balance',
    'total-balance': 'Total holdings',
  };

  listRef = React.createRef<HTMLInputElement>();

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleKeyPress = (event: KeyboardEvent) => {
    if (event && event.key && event.key === 'Escape') {
      event.preventDefault();
      this.setState({ open: false });
    }
  };

  handleClickOutside = (event: MouseEvent) => {
    if (event && this.listRef.current && !this.listRef.current.contains(event.target)) {
      event.preventDefault();
      this.setState({ open: false });
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  render() {
    const { sortBy, onSelectedItem, ...props } = this.props;
    const { open } = this.state;

    return (
      <Container {...props}>
        <Label onClick={this.toggle}>
          {'Sort by: '}
          <SelectedItem>{this.items[sortBy]}</SelectedItem>
          <Arrow />
        </Label>
        {open && (
          <List ref={this.listRef} open={open}>
            {this.buildItemList()}
          </List>
        )}
      </Container>
    );
  }

  private buildItemList() {
    const { sortBy, sortDir } = this.props;
    const nextSort = sortDir === 'asc' ? 'desc' : 'asc';

    return Object.keys(this.items).map(key => (
      <Item key={key} onClick={this.createSorter(key, nextSort)}>
        <SortIcon dir={sortBy === key ? sortDir : 'none'} />
        {this.items[key]}
      </Item>
    ));
  }

  private createSorter(tokenSortBy: TokenSortField, tokenSortDir: SortDir) {
    return () => {
      this.props.onSelectedItem(tokenSortBy, tokenSortDir);
      this.toggle();
    };
  }
}

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  position: relative;
`;

const SelectedItem = styled.span``;
const Arrow = styled.span``;

const Label = styled.label`
  font-size: 0.9em;
  cursor: pointer;
  color: var(--color-greyish);

  ${SelectedItem} {
    color: var(--color-text-primary);
    text-decoration: underline;

    @media (max-width: 480px) {
      display: inline-block;
      vertical-align: bottom;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 84px;
    }
  }

  ${Arrow} {
    margin-left: 8px;
    display: inline-block;
    width: 8px;
    height: 8px;
    background-image: url(${ic_arrow_up});
  }
`;
const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 152px;
  right: 0;
  top: var(--spacing-normal);
  margin-right: var(--spacing-normal);
  background-color: var(--color-main-bg);
  border-radius: 4px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.05);
  z-index: 100;

  @media (max-width: 800px) {
    margin-right: 0;
  }
`;

const Item = styled.li`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 0;
  padding: 0 var(--spacing-narrow);
  font-size: 0.9rem;
  line-height: var(--input-height);
  cursor: pointer;
  color: var(--color-text-primary);

  &:hover {
    background-color: var(--color-content-bg);
  }
`;

export default WalletSort;
