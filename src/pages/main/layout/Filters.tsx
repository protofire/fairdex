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
import { getBuyTokens, getSellTokens } from '../../../store/auctions/selectors';
import { applyFilters, clearFilters } from '../../../store/filters/actions';
import { toggleFilters } from '../../../store/ui/actions';

type Props = StateProps & DispatchProps;

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
  dir: 'up' | 'down' | 'none';
}

class Filters extends React.PureComponent<Props> {
  toggleOption = (option: string, checked: boolean) => {
    this.props.actions.applyFilters({
      ...this.props.filters,
      [option]: checked
    });
  };

  applyFilters = (filters: FiltersState) => {
    this.props.actions.applyFilters(filters);
  };

  render() {
    const { actions, isOpen, sellTokens, buyTokens } = this.props;
    const sellTokensList = this.buildTokenList(sellTokens, 'sellTokens');
    const buyTokensList = this.buildTokenList(buyTokens, 'buyTokens');
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
                <Item>
                  <SortButton dir='up' /> Token
                </Item>
                <Item>
                  <SortButton dir='none' /> Sell volume
                </Item>
                <Item>
                  <SortButton dir='none' /> Estimated end time
                </Item>
              </List>
            </Section>
            <Section>
              <List>
                <Item>
                  <Checkbox
                    name='onlyMyTokens'
                    checked={this.props.filters.onlyMyTokens}
                    onChange={this.toggleOption}
                  />
                  <ItemText>Only tokens I hold</ItemText>
                  <ItemCount>5</ItemCount>
                </Item>
                <Item>
                  <Checkbox
                    name='onlyMyAuctions'
                    checked={this.props.filters.onlyMyAuctions}
                    onChange={this.toggleOption}
                  />
                  <ItemText>Only my auctions</ItemText>
                  <ItemCount>2</ItemCount>
                </Item>
              </List>
            </Section>
            <Section>
              <SubTitle>Sell tokens</SubTitle>
              <List>{sellTokensList}</List>
            </Section>
            <Section>
              <SubTitle>Bid tokens</SubTitle>
              <List>{buyTokensList}</List>
            </Section>
          </Content>
          <Footer>
            <Button onClick={actions.clearFilters}>Clear settings</Button>
          </Footer>
        </Root>
        {isOpen && <Overlay onClick={actions.toggle} />}
      </>
    );
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
        [tokenType]: newFilters
      });
    };
    return list.map(token => {
      const checked = this.props.filters[tokenType].includes(token.id);
      return (
        <Item key={token.id}>
          <Checkbox checked={checked} name={token.id} onChange={applyTokenFilter} />
          <ItemText>{token.name}</ItemText>
          <ItemCount>{token.count}</ItemCount>
        </Item>
      );
    });
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
`;

const ItemText = styled.span`
  flex: 1 1 auto;
  margin-right: var(--spacing-normal);
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
    if (dir === 'up') {
      src = sortUpImage;
    } else if (dir === 'down') {
      src = sortDownImage;
    }
    return `background-image: url(${src})`;
  }}
`;

function mapStateToProps(state: AppState): StateProps {
  return {
    isOpen: state.ui.filtersVisible,
    sellTokens: getSellTokens(state),
    buyTokens: getBuyTokens(state),
    filters: state.filters
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    actions: {
      toggle: () => dispatch(toggleFilters()),
      applyFilters: (filters: FiltersState) => dispatch(applyFilters(filters)),
      clearFilters: () => dispatch(clearFilters())
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
