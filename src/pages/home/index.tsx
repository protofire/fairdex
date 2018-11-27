import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Spinner from '../../components/Spinner';
import * as images from '../../images';

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

  return (
    <Container>
      {content}
      <Footer>
        <img src={images.logo} />
      </Footer>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  min-height: 100vh;

  @media (min-height: 768px) {
    padding-bottom: calc(var(--spacing-wide) * 2);
  }

  h2 {
    text-transform: uppercase;
  }

  h3 {
    font-size: 32px;
    font-weight: 800;
    text-align: center;
    color: var(--color-light-grey-blue);
  }

  p {
    margin: 0;
    font-size: 14px;
    font-weight: normal;

    color: var(--color-greyish);
  }
`;

const Footer = styled.footer`
  margin: var(--spacing-wide) 0;
  user-select: none;

  @media (min-height: 768px) {
    position: absolute;
    bottom: 0;
  }

  img {
    width: 144px;
    height: 40px;
  }
`;

function mapStateToProps({ wallet }: AppState): Props {
  return {
    wallet: wallet.type,
    network: wallet.network
  };
}

export default connect(mapStateToProps)(HomePage);
