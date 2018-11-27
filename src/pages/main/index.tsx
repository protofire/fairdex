import React from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import Spinner from '../../components/Spinner';
import { Content, Layout, NavBar, Sidebar } from './layout';

import logo from '../../images/protofire.svg';

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

class MainPage extends React.Component {
  componentDidMount() {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    });
  }

  render() {
    return (
      <Router>
        <Layout>
          <Sidebar>
            <Branding>
              <NavLink to='/'>
                <img src={logo} height={40} />
              </NavLink>
            </Branding>
            <Wallet />
          </Sidebar>
          <Content>
            <NavBar />
            <Section>
              <Switch>
                <Route path='/running' component={RunningAuctions} />
                <Route path='/scheduled' component={ScheduledAuctions} />
                <Route path='/ended' component={EndedAuctions} />
                <Redirect to='/running' />
              </Switch>
            </Section>
          </Content>
        </Layout>
      </Router>
    );
  }
}

const Branding = styled.header`
  display: flex;
  align-items: center;
  text-align: left;
  height: var(--header-height);
  padding: 0 var(--spacing-normal);
  border-bottom: 1px solid var(--color-border);
  user-select: none;

  & > * {
    width: 0;
    transition: width var(--animation-duration) ease-in-out;

    @media (min-width: 801px) {
      width: 100%;
      text-align: center;
    }
  }
`;

const Section = styled.section`
  display: grid;
  height: 100%;
  padding: var(--spacing-normal);
  overflow-x: auto;
`;

export default MainPage;
