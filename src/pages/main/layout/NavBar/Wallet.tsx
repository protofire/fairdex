import { rem } from 'polished';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Icon from '../../../../components/icons';

import { applyFilters } from '../../../../store/filters/actions';
import { toggleFilters, toggleSidebar } from '../../../../store/ui/actions';

import ActionBar from '../ActionBar';
import HideZeroBalance from './HideZeroBalance';
import WalletSearch from './WalletSearch';
import WalletSort from './WalletSort';

type NavBarProps = StateProps & DispatchProps;

interface StateProps {
  filters: FiltersState;
}

interface DispatchProps {
  actions: {
    toggleSidebar: typeof toggleSidebar;
    applyFilters: typeof applyFilters;
  };
}

interface State {
  tokenSearchQuery: string;
}

class NavBar extends React.PureComponent<NavBarProps, State> {
  state = {
    tokenSearchQuery: '',
  };

  toggleZeroBalance = (option: string, checked: boolean) => {
    this.props.actions.applyFilters({
      ...this.props.filters,
      [option]: checked,
    });
  };

  sortHandler = (tokenSortBy: TokenSortField, tokenSortDir: SortDir) => {
    this.props.actions.applyFilters({
      ...this.props.filters,
      tokenSortBy,
      tokenSortDir,
    });
  };

  render() {
    const { tokenSearchQuery } = this.state;
    const {
      actions,
      filters: { hideZeroBalance, tokenSortDir, tokenSortBy },
    } = this.props;

    return (
      <Container>
        <LeftAction>
          <ToggleSidebar onClick={actions.toggleSidebar} />
          <ActionSearch searchText={tokenSearchQuery} onSearch={/*() => {}*/} />
        </LeftAction>
        <RightAction>
          <Sort onSelectedItem={this.sortHandler} sortBy={tokenSortBy} sortDir={tokenSortDir} />
          <ActionSearch searchText={tokenSearchQuery} onSearch={/*() => {}*/} />
        </RightAction>
        <HideWrapper>
          <HideZeroBalance checked={hideZeroBalance} onChange={this.toggleZeroBalance} />
        </HideWrapper>
      </Container>
    );
  }
}

const Container = styled.nav`
  padding: 0 var(--spacing-normal);
  background-color: transparent;
  border-bottom: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: 1fr 1fr ${rem('145px')};
  grid-template-rows: var(--header-height);

  transition: background-color var(--animation-duration) ease;

  @media (max-width: 800px) {
    border-bottom: 0;
    padding: 0;
    background-color: var(--color-main-bg);
    grid-template-columns: 1fr 8fr;
    grid-template-rows: var(--header-height) calc(var(--header-height) - var(--spacing-normal));
  }
`;

const ToggleSidebar = styled(Icon.Menu)``;

const ActionSearch = styled(WalletSearch)`
  display: flex;
  height: var(--header-height);
  align-items: center;
`;

const HideWrapper = styled(ActionBar)`
  justify-content: flex-end;

  @media (max-width: 800px) {
    height: calc(var(--header-height) - var(--spacing-normal));
    background-color: var(--color-content-bg);
    grid-column: 1 / 3;
    padding-left: var(--spacing-normal);
    justify-content: flex-start;
    align-items: flex-end;
  }
`;

const LeftAction = styled(ActionBar)`
  @media (max-width: 800px) {
    padding-left: var(--spacing-normal);
    border-bottom: 1px solid var(--color-border);
  }

  ${ToggleSidebar} {
    cursor: pointer;
    user-select: none;

    @media (min-width: 801px) {
      display: none;
    }
  }

  ${ActionSearch} {
    @media (max-width: 800px) {
      display: none;
    }
  }
`;

const Sort = styled(WalletSort)`
  padding-right: var(--spacing-normal);
`;

const RightAction = styled(ActionBar)`
  justify-content: flex-end;
  position: relative;

  @media (max-width: 800px) {
    padding-right: var(--spacing-normal);
    border-bottom: 1px solid var(--color-border);

    ${Sort} {
      padding-right: 0;
      position: absolute;
      left: 50%;
      transform: translateX(calc(-50% - var(--spacing-normal)));
    }
  }

  ${ActionSearch} {
    position: absolute;
    right: var(--spacing-normal);
    @media (min-width: 801px) {
      display: none;
    }
  }
`;

function mapStateToProps(state: AppState): StateProps {
  return {
    filters: state.filters,
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    actions: {
      toggleSidebar: () => dispatch(toggleSidebar()),
      applyFilters: (filters: FiltersState) => dispatch(applyFilters(filters)),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);
