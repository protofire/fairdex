import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { NavLink, Redirect, Route, Router, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { history, pageview } from '../../analytics';
import Spinner from '../../components/Spinner';
import logo from '../../images/protofire.svg';
import { getNetworkType } from '../../store/blockchain';
import { isTermsConditionsAccepted } from '../../store/terms-conditions';
import { ClaimProvider } from './auctions/claim/ClaimContext';
import { Content, Filters, Layout, MessageHandler, NavBar, Sidebar } from './layout';

import AccountInfo from './side/AccountInfo';
import WalletInfo from './side/WalletInfo';

const EndedAuctions = Loadable({
  loader: () => import('./auctions/containers/EndedAuctions'),
  loading: () => <Spinner size='large' />,
});

const RunningAuctions = Loadable({
  loader: () => import('./auctions/containers/RunningAuctions'),
  loading: () => <Spinner size='large' />,
});

const ScheduledAuctions = Loadable({
  loader: () => import('./auctions/containers/ScheduledAuctions'),
  loading: () => <Spinner size='large' />,
});

const WalletOverview = Loadable({
  loader: () => import('./wallet-overview'),
  loading: () => <Spinner size='large' />,
});

interface MainPageStateProps {
  network?: Network | null;
  wallet?: Wallet;
  termsConditionsAccepted: boolean;
}

class MainPage extends React.Component<MainPageStateProps> {
  componentDidMount() {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });

    pageview(history.location.pathname);

    history.listen(location => pageview(location.pathname));
  }

  render() {
    const { termsConditionsAccepted, wallet, network } = this.props;

    if (!termsConditionsAccepted) {
      return <Redirect to='/terms-conditions' />;
    } else if (!wallet || !network) {
      return <Redirect to='/select-wallet' />;
    } else if (network !== 'rinkeby') {
      return <Redirect to='/network-not-available' />;
    }

    return (
      <Router history={history}>
        <Layout>
          <Sidebar>
            <Branding>
              <NavLink to='/auction'>
                <img src={logo} height={40} />
              </NavLink>
            </Branding>
            <SideContent>
              <AccountInfo />
              <WalletInfo />
            </SideContent>
          </Sidebar>
          <MessageHandler />
          <Filters />
          <Content>
            <ClaimProvider>
              <NavBar />
              <Section>
                <Switch>
                  <Route path='/auction/running' component={RunningAuctions} />
                  <Route path='/auction/scheduled' component={ScheduledAuctions} />
                  <Route path='/auction/ended' component={EndedAuctions} />
                  <Route path='/wallet' component={WalletOverview} />
                  <Redirect to='/auction/running' />
                </Switch>
              </Section>
            </ClaimProvider>
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
  height: 100%;
  min-height: calc(100vh - var(--header-height));
  padding: var(--spacing-normal);
`;

const SideContent = styled.div`
  display: grid;
  padding: var(--spacing-normal);
  gap: var(--spacing-normal);
`;

function mapStateToProps(state: AppState): MainPageStateProps {
  return {
    network: getNetworkType(state),
    wallet: state.blockchain.wallet,
    termsConditionsAccepted: isTermsConditionsAccepted(state),
  };
}

export default connect(mapStateToProps)(MainPage);
