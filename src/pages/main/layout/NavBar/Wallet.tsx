import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Icon from '../../../../components/icons';
import { toggleFilters, toggleSidebar } from '../../../../store/ui/actions';
import ActionBar from '../ActionBar';
import WalletSearch from './WalletSearch';

type NavBarProps = DispatchProps & RouteComponentProps;

interface DispatchProps {
  actions: {
    toggleSidebar: typeof toggleSidebar;
    toggleFilters: typeof toggleFilters;
  };
}

const NavBar = ({ actions }: NavBarProps) => (
  <Container>
    <LeftAction>
      <ToggleSidebar onClick={actions.toggleSidebar} />
      <ActionSearch searchText={''} onSearch={} />
    </LeftAction>
    <RightAction>
      <Sorting>SORTING</Sorting>
      <ActionSearch searchText={''} onSearch={} />
    </RightAction>
    <Hide>HIDE</Hide>
  </Container>
);

const Container = styled.nav`
  padding: 0 var(--spacing-normal);
  background-color: transparent;
  border-bottom: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: var(--header-height);

  transition: background-color var(--animation-duration) ease;

  @media (max-width: 800px) {
    border-bottom: 0;
    padding: 0;
    background-color: var(--color-main-bg);
    grid-template-columns: 1fr 8fr;
    grid-template-rows: var(--header-height) var(--header-height);
  }
`;

const ToggleSidebar = styled(Icon.Menu)``;
const ActionSearch = styled(WalletSearch)``;

const Sorting = styled.div`
  background-color: red;
`;
const Hide = styled(ActionBar)`
  @media (max-width: 800px) {
    background-color: var(--color-content-bg);
    grid-column: 1 / 3;
    padding-left: var(--spacing-normal);
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

const RightAction = styled(ActionBar)`
  justify-content: flex-end;

  @media (max-width: 800px) {
    padding-right: var(--spacing-normal);
    border-bottom: 1px solid var(--color-border);

    ${Sorting} {
      flex: 1;
    }
  }

  ${ActionSearch} {
    @media (min-width: 801px) {
      display: none;
    }
  }
`;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    actions: {
      toggleSidebar: () => dispatch(toggleSidebar()),
      toggleFilters: () => dispatch(toggleFilters()),
    },
  };
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(NavBar),
);
