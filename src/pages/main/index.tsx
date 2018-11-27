import React from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Link, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import Spinner from '../../components/Spinner';
import { Menu, MenuItem } from './auctions/components/Menu';

const EndedAuctions = Loadable({
  loader: () => import('./auctions/containers/EndedAuctions'),
  loading: () => <Spinner size='large' />
});

const RunningAuctions = Loadable({
  loader: () => import('./auctions/containers/RunningAuctions'),
  loading: () => <Spinner size='large' />
});

const ScheduledAuctions = Loadable({
  loader: () => import('./auctions/containers/ScheduledAuctions'),
  loading: () => <Spinner size='large' />
});

const Wallet = Loadable({
  loader: () => import('./wallet'),
  loading: () => <Spinner size='large' />
});

const Layout = styled.div`
  display: grid;
  width: 100%;
  min-height: 100vh;

  @media (min-width: 801px) {
    grid-template-columns: var(--sidebar-width) 1fr;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  background: var(--color-main-bg);
  min-width: var(--sidebar-width);

  @media (max-width: 800px) {
    display: none;
  }
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--header-height);
  padding: 0 var(--spacing-normal);
  border-bottom: 1px solid var(--color-border);

  ${Menu} {
    height: 100%;

    a {
      line-height: calc(var(--header-height) - 1px);
    }
  }
`;

const Branding = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--header-height);
  text-align: center;
  border-bottom: 1px solid var(--color-border);
  user-select: none;
`;

const Root = styled.section`
  display: grid;
  padding: var(--spacing-normal);
  overflow-x: auto;
`;

class MainPage extends React.Component {
  render() {
    return (
      <Router>
        <Layout>
          <Sidebar>
            <Branding>
              <Link to='/'>
                <img src='https://protofire.io/img/protofire.svg' />
              </Link>
            </Branding>
            <Wallet />
          </Sidebar>
          <main>
            <NavBar>
              <Menu>
                <MenuItem>
                  <NavLink to={`/running`}>Running</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to={`/scheduled`}>Scheduled</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to={`/ended`}>Ended</NavLink>
                </MenuItem>
              </Menu>
            </NavBar>
            <Root>
              <Switch>
                <Route path='/running' component={RunningAuctions} />
                <Route path='/scheduled' component={ScheduledAuctions} />
                <Route path='/ended' component={EndedAuctions} />
                <Redirect to='/running' />
              </Switch>
            </Root>
          </main>
        </Layout>
      </Router>
    );
  }
}

export default MainPage;
