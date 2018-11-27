import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Spinner from '../../components/Spinner';

const MainPage = Loadable({
  loader: () => import('../main'),
  loading: () => <Spinner size='large' />
});

const NetworkNotAvailable = Loadable({
  loader: () => import('./NetworkNotAvailable'),
  loading: () => <Spinner size='large' />
});

const SelectWallet = Loadable({
  loader: () => import('./SelectWallet'),
  loading: () => <Spinner size='large' />
});

interface Props {
  network?: NetworkType;
  wallet?: WalletType;
}

const HomePage = ({ network, wallet }: Props) => {
  let content = null;

  if (!wallet) {
    content = <SelectWallet />;
  } else if (network !== 'rinkeby') {
    content = <NetworkNotAvailable />;
  } else {
    return <MainPage />;
  }

  return <Container>{content}</Container>;
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  min-height: 100vh;

  h2 {
    text-transform: uppercase;
  }

  p {
    margin: 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.29;
    letter-spacing: -0.4px;

    color: var(--color-greyish);
  }
`;

function mapStateToProps({ wallet }: AppState): Props {
  return {
    wallet: wallet.type,
    network: wallet.network
  };
}

export default connect(mapStateToProps)(HomePage);
