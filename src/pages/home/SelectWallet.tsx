import React, { FunctionComponent, useCallback } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Separator from '../../components/Separator';
import * as images from '../../images';
import { getNetworkType, init } from '../../store/blockchain';
import { isTermsConditionsAccepted } from '../../store/terms-conditions';
import spinner from './spinner';
import { Container, Content, Footer } from './utils';

type Props = AppStateProps & DispatchProps;

interface AppStateProps {
  network?: Network | null;
  wallet?: Wallet;
  termsConditionsAccepted: boolean;
}

interface DispatchProps {
  onSelectWallet: (wallet: Wallet) => void;
}

const AVAILABLE_NETWORKS = ['main', 'rinkeby'];

const SelectWallet: FunctionComponent<Props> = ({
  network,
  wallet,
  termsConditionsAccepted,
  onSelectWallet,
}) => {
  const handleWalletSelection = useCallback(
    (selected: Wallet) => {
      if (onSelectWallet) {
        onSelectWallet(selected);
      }
    },
    [onSelectWallet, wallet],
  );

  const selectWallet = (selected: Wallet) => () => handleWalletSelection(selected);

  if (!termsConditionsAccepted) {
    return <Redirect to='/terms-conditions' />;
  } else if (wallet && !network) {
    handleWalletSelection(wallet);
    return spinner;
  } else if (wallet && network && !AVAILABLE_NETWORKS.includes(network)) {
    return <Redirect to='/network-not-available' />;
  } else if (wallet && network) {
    return <Redirect to='/auction' />;
  } else {
    return (
      <Container>
        <Content>
          <h2>Select Wallet</h2>
          <Separator />
          <WalletList>
            <Wallet onClick={selectWallet('standard')}>
              <Logos>
                <img src={images.wallet.MetaMask} alt='MetaMask' />
                <img src={images.wallet.Safe} alt='Gnosis Safe' />
                {/* <img src={images.wallet.Cipher} alt='Cipher' /> */}
              </Logos>
              <h3>Standard Wallet</h3>
              <p>MetaMask, Safe{/*, Cipher */}</p>
            </Wallet>
            {/*
              <Wallet disabled={true} onClick={selectWallet('ledger')}>
                <Logos>
                  <img src={images.wallet.LedgerNano} alt='Ledger Nano' />
                </Logos>
                <h3>Ledger Nano</h3>
                <p />
              </Wallet>
              */}
          </WalletList>
        </Content>
        <Footer>
          <img src={images.geco} /> <span>Grant by the Gnosis Ecosystem Fund</span>
        </Footer>
      </Container>
    );
  }
};

const WalletList = styled.div`
  display: grid;
  grid-gap: var(--spacing-normal);
  margin: var(--spacing-normal) 0 0;

  @media (min-width: 801px) {
    grid-template-columns: 1fr /*1fr*/;
  }
`;

const Wallet = styled.button`
  padding: var(--spacing-normal);
  background-color: var(--color-main-bg);
  border: none;
  border-radius: 8px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;

  transition: transform 100ms ease-in-out;
  will-change: transform;

  &:disabled {
    pointer-events: none;
    touch-action: none;
    opacity: 0.5;
  }

  &:focus {
    outline: 0;
  }

  &:hover {
    box-shadow: 0 24px 60px 0 rgba(133, 195, 214, 0.5);
    transform: translateY(-2%);
  }
`;

const Logos = styled.div`
  display: grid;
  grid-gap: var(--spacing-normal);
  grid-auto-flow: column;
  place-content: center;
  margin: var(--spacing-normal) 0;

  img {
    width: 48px;
    height: 48px;
  }

  p {
    height: var(--spacing-normal);
    line-height: var(--spacing-normal);
    margin-bottom: var(--spacing-narrow);
  }
`;

function mapStateToProps(state: AppState): AppStateProps {
  return {
    network: getNetworkType(state),
    wallet: state.blockchain.wallet,
    termsConditionsAccepted: isTermsConditionsAccepted(state),
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    onSelectWallet: wallet => dispatch(init(wallet)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectWallet);
