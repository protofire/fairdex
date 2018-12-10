import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Spinner from '../../components/Spinner';
import * as images from '../../images';
import { getNetworkType } from '../../store/blockchain';

const spinner = <Spinner size='large' />;

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

interface Props {
  network?: Network;
  wallet?: Wallet;
}

const HomePage = React.memo(({ network, wallet }: Props) => {
  let content = null;

  if (!wallet) {
    content = <SelectWallet />;
  } else if (!network) {
    return spinner;
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
});

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

export default connect(
  (state: AppState): Props => ({
    network: getNetworkType(state),
    wallet: state.blockchain.wallet,
  }),
)(HomePage);
