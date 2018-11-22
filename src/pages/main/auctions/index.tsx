import React, { FunctionComponent } from 'react';
import Loadable from 'react-loadable';
import { NavLink, Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Grid from '../../../components/Grid';
import Menu from './components/Menu';
import ViewMode from './components/ViewMode';

const Container = styled.section`
  display: grid;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--header-height);
  padding: 0 var(--spacing-normal);
  border-bottom: 1px solid var(--color-border);

  ${Menu.Container} {
    height: 100%;

    a {
      line-height: calc(var(--header-height) - 1px);
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

  ${Grid} {
  }
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
