import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import Icon from '../../../components/icons';
import Overlay from '../../../components/Overlay';
import SortIcon from '../../../components/SortIcon';

import {
  getBuyTokens,
  getFilteredClaimableAuctions,
  getFilteredMyTokensAuctions,
  getSellTokens,
} from '../../../store/blockchain';
import { applyFilters, clearFilters } from '../../../store/filters/actions';
import { toggleFilters } from '../../../store/ui/actions';
import DynamicList from './DynamicList';

type Props = StateProps & DispatchProps & RouteComponentProps;

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
  myTokensAuctionsCount: number;
  claimableCount: number;
}

interface DispatchProps {
  actions: {
    toggle: typeof toggleFilters;
    applyFilters: typeof applyFilters;
    clearFilters: typeof clearFilters;
  };
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
      claimableCount,
    } = this.props;
    const sellTokensList = this.buildTokenList(
      this.filterTokens(sellTokens, this.state.sellTokenSearchQuery),
      'sellTokens',
    );
    const buyTokensList = this.buildTokenList(
      this.filterTokens(buyTokens, this.state.buyTokenSearchQuery),
      'buyTokens',
    );

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
                <Item onClick={this.createSorter('bid-token')}>
                  <SortIcon dir={filters.auctionSortBy === 'bid-token' ? filters.auctionSortDir : 'none'} />
                  <Label>Token</Label>
                </Item>
                <Item onClick={this.createSorter('sell-volume')}>
                  <SortIcon dir={filters.auctionSortBy === 'sell-volume' ? filters.auctionSortDir : 'none'} />
                  <Label>Sell volume</Label>
                </Item>
                <Item onClick={this.createSorter('end-time')}>
                  <SortIcon dir={filters.auctionSortBy === 'end-time' ? filters.auctionSortDir : 'none'} />
                  <Label>
                    {this.props.location.pathname.endsWith('running') && 'Estimated end time'}
                    {this.props.location.pathname.endsWith('scheduled') && 'Start time'}
                    {this.props.location.pathname.endsWith('ended') && 'End time'}
                  </Label>
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
                      onToggle={this.toggleOption}
                    />
                    Only tokens I hold
                  </Label>
                  <ItemCount>{myTokensAuctionsCount}</ItemCount>
                </Item>
                <Item>
                  <Label>
                    <Checkbox
                      name='claimableAuctions'
                      checked={this.props.filters.claimableAuctions}
                      onToggle={this.toggleOption}
                    />
                    Only claimable auctions
                  </Label>
                  <ItemCount>{claimableCount}</ItemCount>
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

  private createSorter(auctionSortBy: AuctionSortField) {
    return () => {
      const { actions, filters } = this.props;

      actions.applyFilters({
        auctionSortBy,
        auctionSortDir:
          auctionSortBy === filters.auctionSortBy && filters.auctionSortDir === 'asc' ? 'desc' : 'asc',
      });
    };
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
            <Checkbox checked={checked} name={token.id} onToggle={applyTokenFilter} />
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

function mapStateToProps(state: AppState): StateProps {
  const myTokensAuctions = getFilteredMyTokensAuctions(state);
  const claimableAuctions = getFilteredClaimableAuctions(state);

  return {
    isOpen: state.ui.filtersVisible,
    sellTokens: getSellTokens(state),
    buyTokens: getBuyTokens(state),
    filters: state.filters,
    myTokensAuctionsCount: myTokensAuctions.length,
    claimableCount: claimableAuctions.length,
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Filters),
);
