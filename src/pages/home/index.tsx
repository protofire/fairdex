import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../../analytics';

import { getNetworkType, init } from '../../store/blockchain';
import { isTermsConditionsAccepted } from '../../store/terms-conditions';
import Landing from './Landing';
import spinner from './spinner';
import TermsAndConditions from './TermsAndConditions';

const MainPage = Loadable({
  loader: () => import('../main'),
  loading: () => spinner,
});

const NetworkNotAvailable = Loadable({
  loader: () => import('./NetworkNotAvailable'),
  loading: () => spinner,
});

const SelectWallet = Loadable({
  loader: () => import('./SelectWallet'),
  loading: () => spinner,
});

interface HomePageStateProps {
  network?: Network | null;
  wallet?: Wallet;
  termsConditionsAccepted: boolean;
}

interface DispatchProps {
  initWallet: (wallet: Wallet) => void;
}

type Props = HomePageStateProps & DispatchProps;

const HomePage = React.memo(({ network, wallet, initWallet }: Props) => {
  if (wallet && !network) {
    initWallet(wallet);
    return spinner;
  } else {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/terms-conditions' component={TermsAndConditions} />
          <Route path='/select-wallet' exact component={SelectWallet} />
          <Route path='/network-not-available' exact component={NetworkNotAvailable} />
          <Route component={MainPage} />
        </Switch>
      </Router>
    );
  }
});

function mapStateToProps(state: AppState): HomePageStateProps {
  return {
    network: getNetworkType(state),
    wallet: state.blockchain.wallet,
    termsConditionsAccepted: isTermsConditionsAccepted(state),
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    initWallet: wallet => dispatch(init(wallet)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
