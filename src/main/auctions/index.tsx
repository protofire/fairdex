import React, { FunctionComponent } from 'react';
import Loadable from 'react-loadable';
import { NavLink, Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Menu from './components/Menu';
import ViewMode from './components/ViewMode';

const Container = styled.section`
  display: grid;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 var(--spacing-normal);
  border-bottom: 1px solid lightgray;

  ${Menu.Container} {
    height: 100%;

    a {
      line-height: var(--header-height);
    }
  }

  ${ViewMode.Selector} {
    margin-left: var(--spacing-normal);
  }
`;

const Content = styled.section`
  height: 100%;
  padding: var(--spacing-normal);
  overflow-x: auto;
`;

const EndedAuctions = Loadable({
  loader: () => import('./containers/EndedAuctions'),
  loading: () => <h4>Loading...</h4>
});

const RunningAuctions = Loadable({
  loader: () => import('./containers/RunningAuctions'),
  loading: () => <h4>Loading...</h4>
});

const ScheduledAuctions = Loadable({
  loader: () => import('./containers/ScheduledAuctions'),
  loading: () => <h4>Loading...</h4>
});

const AuctionList: FunctionComponent<Props> = ({ match }) => (
  <Container>
    <NavBar>
      <Menu.Container>
        <Menu.Item>
          <NavLink to={`${match.path}/running`}>Running</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to={`${match.path}/scheduled`}>Scheduled</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to={`${match.path}/ended`}>Ended</NavLink>
        </Menu.Item>
      </Menu.Container>
      <ViewMode.Selector>
        <ViewMode.Button>x</ViewMode.Button>
        <ViewMode.Button>y</ViewMode.Button>
        <ViewMode.Button>z</ViewMode.Button>
      </ViewMode.Selector>
    </NavBar>
    <Content>
      <Switch>
        <Route path={`${match.path}/running`} component={RunningAuctions} />
        <Route path={`${match.path}/scheduled`} component={ScheduledAuctions} />
        <Route path={`${match.path}/ended`} component={EndedAuctions} />
        <Redirect to={`${match.path}/running`} />
      </Switch>
    </Content>
  </Container>
);

interface Props extends RouteComponentProps<any> {}

export default withRouter(AuctionList);
