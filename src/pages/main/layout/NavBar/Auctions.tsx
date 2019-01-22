import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import styled, { css } from 'styled-components';

import Icon from '../../../../components/icons';
import { isFiltering } from '../../../../store/filters';
import { toggleFilters, toggleSidebar } from '../../../../store/ui/actions';
import ActionBar from '../ActionBar';

type NavBarProps = StateProps & DispatchProps & RouteComponentProps;

interface StateProps {
  filterIndicator: boolean;
}

interface DispatchProps {
  actions: {
    toggleSidebar: typeof toggleSidebar;
    toggleFilters: typeof toggleFilters;
  };
}

const NavBar = ({ actions, filterIndicator }: NavBarProps) => (
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
      <ToggleFilters onClick={actions.toggleFilters} pinned={filterIndicator}>
        <Icon.Preferences />
      </ToggleFilters>
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

const ToggleFilters = styled.div`
  position: relative;
  cursor: pointer;
  user-select: none;

  ${(props: { pinned?: boolean }) =>
    props.pinned &&
    css`
      &:after {
        content: '';
        position: absolute;
        top: -5px;
        right: -5px;
        width: 15px;
        height: 15px;
        background-color: var(--color-accent);
        border: 2px solid var(--color-content-bg);
        border-radius: 50%;
      }
    `};
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

function mapStateToProps(state: AppState): StateProps {
  return {
    filterIndicator: isFiltering(state),
  };
}

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
    mapStateToProps,
    mapDispatchToProps,
  )(NavBar),
);
