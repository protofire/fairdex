import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Icon from '../../../components/icons';
import { toggleFilters, toggleSidebar } from '../../../store/ui/actions';
import ActionBar from './ActionBar';

type NavBarProps = DispatchProps & RouteComponentProps;

interface DispatchProps {
  actions: {
    toggleSidebar: typeof toggleSidebar;
    toggleFilters: typeof toggleFilters;
  };
}

const NavBar = ({ actions }: NavBarProps) => (
  <Container>
    <ActionBar side='left'>
      <ToggleSidebar onClick={actions.toggleSidebar} />
    </ActionBar>
    <TabBar>
      <Tab>
        <NavLink to='/running'>Running</NavLink>
      </Tab>
      <Tab>
        <NavLink to='/scheduled'>Scheduled</NavLink>
      </Tab>
      <Tab>
        <NavLink to='/ended'>Ended</NavLink>
      </Tab>
    </TabBar>
    <ActionBar side='right'>
      <ToggleFilters onClick={actions.toggleFilters} />
    </ActionBar>
  </Container>
);

const Container = styled.nav`
  text-align: center;
  height: var(--header-height);
  padding: 0 var(--spacing-normal);
  background-color: var(--color-main-bg);
  border-bottom: 1px solid var(--color-border);

  transition: background-color var(--animation-duration) ease;

  @media (min-width: 801px) {
    background-color: transparent;
  }
`;

const ToggleSidebar = styled(Icon.Menu)`
  cursor: pointer;
  user-select: none;

  @media (min-width: 801px) {
    visibility: hidden;
  }
`;

const ToggleFilters = styled(Icon.Preferences)`
  cursor: pointer;
  user-select: none;
`;

export const TabBar = styled.ul`
  display: inline-grid;
  grid-auto-flow: column;
  column-gap: var(--spacing-normal);
  height: 100%;

  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 480px) {
    display: none;
  }
`;

export const Tab = styled.li`
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0;
  user-select: none;

  a {
    font-size: 15px;
    font-weight: bold;
    line-height: calc(var(--header-height) - 1px);
    text-transform: uppercase;
    color: var(--color-text-secondary);

    &:hover,
    &.active {
      color: var(--color-text-primary);
    }

    &.active {
      position: relative;

      &:after {
        position: absolute;
        content: '';
        height: 3px;
        left: 0;
        right: 0;
        bottom: -2.5px;
        background: var(--color-accent);
        border-radius: 10px;
        box-shadow: 0 1px 8px 0 var(--color-accent-shadow);
      }
    }
  }
`;

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    actions: {
      toggleSidebar: () => dispatch(toggleSidebar()),
      toggleFilters: () => dispatch(toggleFilters())
    }
  };
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(NavBar)
);
