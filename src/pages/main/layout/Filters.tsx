import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import Icon from '../../../components/icons';
import Overlay from '../../../components/Overlay';
import sortDownImage from '../../../images/sorting_arrow_down.svg';
import sortUpImage from '../../../images/sorting_arrow_up.svg';
import sortNoneImage from '../../../images/sorting_inactive.svg';
import {
  getBuyTokens,
  getFilteredMyAuctions,
  getFilteredMyTokensAuctions,
  getSellTokens,
} from '../../../store/blockchain';
import { applyFilters, clearFilters } from '../../../store/filters/actions';
import { toggleFilters } from '../../../store/ui/actions';
import DynamicList from './DynamicList';

type Props = StateProps & DispatchProps;

interface State {
  sellTokenSearchQuery: string;
  buyTokenSearchQuery: string;
  resetCounter: number;
}

interface StateProps {
  isOpen?: boolean;
  sellTokens: TokenInfo[];
  buyTokens: TokenInfo[];
  filters: FiltersState;
}

interface DispatchProps {
  actions: {
    toggle: typeof toggleFilters;
    applyFilters: typeof applyFilters;
    clearFilters: typeof clearFilters;
  };
}

interface SortButtonProps {
  dir: SortDir;
}

class Filters extends React.PureComponent<Props, State> {
  state = {
    sellTokenSearchQuery: '',
    buyTokenSearchQuery: '',
    resetCounter: 1,
  };

  toggleOption = (option: string, checked: boolean) => {
    this.props.actions.applyFilters({
      ...this.props.filters,
      [option]: checked,
    });
  };

  applyFilters = (filters: FiltersState) => {
    this.props.actions.applyFilters(filters);
  };

  clearFilters = () => {
    this.setState({
      sellTokenSearchQuery: '',
      buyTokenSearchQuery: '',
      resetCounter: this.state.resetCounter + 1,
    });
    this.props.actions.clearFilters();
  };

  searchSellToken = (value: string) => {
    this.setState({ sellTokenSearchQuery: value });
  };

  searchBuyToken = (value: string) => {
    this.setState({ buyTokenSearchQuery: value });
  };

  render() {
    const {
      actions,
      isOpen,
      sellTokens,
      buyTokens,
      filters,
      myTokensAuctionsCount,
      myAuctionsCount,
    } = this.props;
    const sellTokensList = this.buildTokenList(
      this.filterTokens(sellTokens, this.state.sellTokenSearchQuery),
      'sellTokens',
    );
    const buyTokensList = this.buildTokenList(
      this.filterTokens(buyTokens, this.state.buyTokenSearchQuery),
      'buyTokens',
    );
    const nextSort = filters.sortDir === 'asc' ? 'desc' : 'asc';

    return (
      <>
        <Root {...this.props}>
          <Header>
            <Title>Sort & Filter</Title>
            <CloseButton onClick={actions.toggle} />
          </Header>
          <Content>
            <Section>
              <SubTitle>Sort By</SubTitle>
              <List>
                <Item onClick={this.createSorter('buy-token', nextSort)}>
                  <SortButton dir={filters.sortBy === 'buy-token' ? filters.sortDir : 'none'} />
                  <Label>Token</Label>
                </Item>
                <Item onClick={this.createSorter('sell-volume', nextSort)}>
                  <SortButton dir={filters.sortBy === 'sell-volume' ? filters.sortDir : 'none'} />
                  <Label>Sell volume</Label>
                </Item>
                <Item onClick={this.createSorter('start-time', nextSort)}>
                  <SortButton dir={filters.sortBy === 'start-time' ? filters.sortDir : 'none'} />
                  <Label>Estimated end time</Label>
                </Item>
              </List>
            </Section>
            <Section>
              <List>
                <Item>
                  <Label>
                    <Checkbox
                      name='onlyMyTokens'
                      checked={this.props.filters.onlyMyTokens}
                      onChange={this.toggleOption}
                    />
                    Only tokens I hold
                  </Label>
                  <ItemCount>{myTokensAuctionsCount}</ItemCount>
                </Item>
                <Item>
                  <Label>
                    <Checkbox
                      name='onlyMyAuctions'
                      checked={this.props.filters.onlyMyAuctions}
                      onChange={this.toggleOption}
                    />
                    Only my auctions
                  </Label>
                  <ItemCount>{myAuctionsCount}</ItemCount>
                </Item>
              </List>
            </Section>
            <Section>
              <DynamicList
                key={this.state.resetCounter}
                title={`Sell tokens (${sellTokensList.length})`}
                searchText={this.state.sellTokenSearchQuery}
                onSearch={this.searchSellToken}
              >
                {sellTokensList}
              </DynamicList>
            </Section>
            <Section>
              <DynamicList
                key={this.state.resetCounter}
                title={`Bid tokens (${buyTokensList.length})`}
                searchText={this.state.buyTokenSearchQuery}
                onSearch={this.searchBuyToken}
              >
                {buyTokensList}
              </DynamicList>
            </Section>
          </Content>
          <Footer>
            <Button onClick={this.clearFilters}>Clear settings</Button>
          </Footer>
        </Root>
        {isOpen && <Overlay onClick={actions.toggle} />}
      </>
    );
  }

  private createSorter(sortBy: SortField, sortDir: SortDir) {
    return () => this.props.actions.applyFilters({ sortBy, sortDir });
  }

  private buildTokenList(list: TokenInfo[], tokenType: 'sellTokens' | 'buyTokens') {
    const { filters } = this.props;

    const applyTokenFilter = (id: string, checked: boolean) => {
      const newFilters = Array.from(filters[tokenType]);
      if (checked && !filters[tokenType].includes(id)) {
        newFilters.push(id);
      } else if (!checked) {
        const indexOfToken = newFilters.indexOf(id);
        if (indexOfToken > -1) {
          newFilters.splice(indexOfToken, 1);
        }
      }
      this.props.actions.applyFilters({
        [tokenType]: newFilters,
      });
    };

    return list.map(token => {
      const checked = this.props.filters[tokenType].includes(token.id);

      return (
        <Item key={token.id}>
          <Label>
            <Checkbox checked={checked} name={token.id} onChange={applyTokenFilter} />
            <span className='text'>{token.name}</span>
          </Label>
          <ItemCount>{token.count}</ItemCount>
        </Item>
      );
    });
  }

  private filterTokens(list: TokenInfo[], filterText: string) {
    if (!filterText) {
      return list;
    }
    return list.filter(token => token.id.toLowerCase().startsWith(filterText.toLowerCase()));
  }
}

const Root = styled.div`
  position: fixed;
  width: var(--sidebar-width);
  display: flex;
  flex-flow: column nowrap;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 101;
  transition: transform var(--animation-duration) ease-in-out;
  background: var(--color-main-bg);
  transform: translateX(${(props: StateProps) => (props.isOpen ? '0' : '100%')});
  color: var(--color-text-primary);
`;

const Content = styled.div`
  overflow: auto;
  flex: 1 1 auto;
  padding-bottom: calc(var(--spacing-normal) * 4);
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff 32%, #fff);
  padding: var(--spacing-normal);
  padding-top: calc(var(--spacing-normal) * 2);
  pointer-events: none;

  ${Button} {
    pointer-events: auto;
  }
`;

const CloseButton = styled(Icon.Close)`
  cursor: pointer;
  margin-left: 2rem;
`;

const Header = styled.header`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding: 0 var(--spacing-normal);
  background-color: var(--color-main-bg);
  border-bottom: 1px solid var(--color-border);
`;

const Title = styled.h2`
  font-size: 1em;
  font-weight: bold;
  text-transform: uppercase;
`;

const SubTitle = styled.h3`
  margin-bottom: var(--spacing-title);
  font-size: 0.9em;
  font-weight: bold;
`;

const Section = styled.div`
  padding: var(--spacing-normal) 0;
  margin: 0 var(--spacing-normal);
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: 0;
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 0.75em 0;
  font-size: 0.9em;
  cursor: pointer;
`;

const Label = styled.label`
  flex: 1 1 auto;
  margin-right: var(--spacing-normal);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  .text {
    vertical-align: middle;
  }
`;

const ItemCount = styled.span`
  color: var(--color-greyish);
`;

const SortButton = styled.span`
  width: 14px;
  height: 14px;
  display: inline-block;
  margin-right: var(--spacing-text);
  object-fit: contain;
  cursor: pointer;

  ${({ dir }: SortButtonProps) => {
    let src = sortNoneImage;
    if (dir === 'asc') {
      src = sortUpImage;
    } else if (dir === 'desc') {
      src = sortDownImage;
    }
    return `background-image: url(${src})`;
  }}
`;

function mapStateToProps(state: AppState): StateProps {
  const myTokensAuctions = getFilteredMyTokensAuctions(state);
  const myAuctions = getFilteredMyAuctions(state);

  return {
    isOpen: state.ui.filtersVisible,
    sellTokens: getSellTokens(state),
    buyTokens: getBuyTokens(state),
    filters: state.filters,
    myTokensAuctionsCount: myTokensAuctions.length,
    myAuctionsCount: myAuctions.length,
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    actions: {
      toggle: () => dispatch(toggleFilters()),
      applyFilters: (filters: FiltersState) => dispatch(applyFilters(filters)),
      clearFilters: () => dispatch(clearFilters()),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Filters);
