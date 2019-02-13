import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { NavLink, Redirect, Route, Router, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { history, pageview } from '../../analytics';
import Spinner from '../../components/Spinner';
import fairdex from '../../images/fairdex.png';
import { fetchData, getNetworkType } from '../../store/blockchain';
import { isTermsConditionsAccepted } from '../../store/terms-conditions';
import { ClaimProvider } from './auctions/claim/ClaimContext';

import { Content, Filters, Layout, MessageHandler, NavBar, Sidebar } from './layout';
import AccountInfo from './side/AccountInfo';
import NavMenu from './side/NavMenu';
import WalletInfo from './side/WalletInfo';

const EndedAuctions = Loadable({
  loader: () => import('./auctions/tabs/EndedAuctions'),
  loading: () => <Spinner size='large' />,
});

const RunningAuctions = Loadable({
  loader: () => import('./auctions/tabs/RunningAuctions'),
  loading: () => <Spinner size='large' />,
});

const ScheduledAuctions = Loadable({
  loader: () => import('./auctions/tabs/ScheduledAuctions'),
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

interface DispatchProps {
  fetchData: () => void;
}

type Props = MainPageStateProps & DispatchProps;

const AVAILABLE_NETWORKS = ['main', 'rinkeby'];

class MainPage extends React.Component<Props> {
  componentDidMount() {
    const { wallet, network } = this.props;
    if (wallet && network) {
      this.props.fetchData();
    }

    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });

    pageview(history.location.pathname);

    history.listen(location => pageview(location.pathname));
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.wallet !== this.props.wallet || prevProps.network !== this.props.network) {
      this.props.fetchData();
    }
  }

  render() {
    const { termsConditionsAccepted, wallet, network } = this.props;

    if (!termsConditionsAccepted) {
      return <Redirect to='/terms-conditions' />;
    } else if (!wallet || !network) {
      return <Redirect to='/select-wallet' />;
    } else if (wallet && !network) {
      return Spinner;
    } else if (!AVAILABLE_NETWORKS.includes(network)) {
      return <Redirect to='/network-not-available' />;
    } else {
      return (
        <Router history={history}>
          <Layout>
            <Sidebar>
              <Branding>
                <NavLink to='/auction'>
                  <img src={fairdex} height={40} />
                </NavLink>
              </Branding>
              <SideContent>
                <NavMenu />
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

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    fetchData: () => dispatch(fetchData()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainPage);
