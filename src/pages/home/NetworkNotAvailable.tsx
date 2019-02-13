import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getNetworkType, initWallet } from '../../store/blockchain';
import { isTermsConditionsAccepted } from '../../store/terms-conditions';

import Separator from '../../components/Separator';
import * as images from '../../images';
import spinner from './spinner';
import { Container, Content, Footer } from './utils';

type Props = NetworkNotAvailableStateProps & DispatchProps;

interface NetworkNotAvailableStateProps {
  network?: Network | null;
  wallet?: Wallet;
  termsConditionsAccepted: boolean;
}

interface DispatchProps {
  initializeWallet: (wallet: Wallet) => void;
}

const NetworkNotAvailable: FunctionComponent<Props> = ({
  network,
  wallet,
  termsConditionsAccepted,
  initializeWallet,
}) => {
  if (!termsConditionsAccepted) {
    return <Redirect to='/terms-conditions' />;
  } else if (!wallet) {
    return <Redirect to='/select-wallet' />;
  } else if (!network) {
    initializeWallet(wallet);
    return spinner;
  } else if (network && network === 'rinkeby') {
    return <Redirect to='/' />;
  }

  return (
    <Container>
      <Content>
        <h2>This ÐApp is not available on your network</h2>
        <Separator />
        <p>Make sure you're connected to the Rinkeby Test Network</p>
      </Content>
      <Footer>
        <img src={images.geco} /> <span>Grant by the Gnosis Ecosystem Fund</span>
      </Footer>
    </Container>
  );
};

function mapStateToProps(state: AppState): NetworkNotAvailableStateProps {
  return {
    network: getNetworkType(state),
    wallet: state.blockchain.wallet,
    termsConditionsAccepted: isTermsConditionsAccepted(state),
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    initializeWallet: wallet => dispatch(initWallet(wallet)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkNotAvailable);
