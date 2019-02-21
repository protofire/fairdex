import React from 'react';
import Scrollbar from 'react-custom-scrollbars';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { BrowserRouter as Router, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import Spinner from '../../components/Spinner';
import fairdex from '../../images/fairdex.png';
import { fetchData, getNetworkType } from '../../store/blockchain';
import { isTermsConditionsAccepted } from '../../store/terms-conditions';
import { ClaimProvider } from './auctions/claim/ClaimContext';

import { Content, Filters, Layout, MessageHandler, NavBar, Sidebar } from './layout';
import AccountInfo from './side/AccountInfo';
import NavMenu from './side/NavMenu';
import WalletInfo from './side/WalletInfo';

import Logos from '../../components/Logos';

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
        <Router>
          <Layout>
            <Sidebar>
              <Branding>
                <NavLink to='/auctions'>
                  <img src={fairdex} height={40} />
                </NavLink>
              </Branding>
              <Scrollbar autoHide={true} autoHideTimeout={500}>
                <SideContent>
                  <NavMenu />
                  <AccountInfo />
                  <WalletInfo />
                  <Footer />
                </SideContent>
              </Scrollbar>
            </Sidebar>
            <MessageHandler />
            <Filters />
            <Content>
              <ClaimProvider>
                <NavBar />
                <Section>
                  <Switch>
                    <Route path='/auctions/running' component={RunningAuctions} />
                    <Route path='/auctions/scheduled' component={ScheduledAuctions} />
                    <Route path='/auctions/ended' component={EndedAuctions} />
                    <Route path='/wallet' component={WalletOverview} />
                    <Redirect to='/auctions/running' />
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
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  min-height: var(--header-height);
  padding: 0 var(--spacing-normal);
  background-color: var(--color-main-bg);
  border-bottom: 1px solid var(--color-border);
  user-select: none;
`;

const Section = styled.section`
  height: 100%;
  min-height: calc(100vh - var(--header-height));
  padding: var(--spacing-normal);
  overflow: auto;
`;

const SideContent = styled.div`
  padding: var(--spacing-normal);
  overflow: auto;
  flex: 1;

  & > * {
    margin-bottom: var(--spacing-normal);
  }
`;

const Footer = styled(Logos)`
  padding-bottom: 0;
  margin-bottom: 0;

  div:first-of-type {
    img {
      height: 30px;
    }
  }
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
