import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Separator from '../../components/Separator';
import * as images from '../../images';
import { getNetworkType, initWallet } from '../../store/blockchain';
import spinner from './spinner';

type Props = AppStateProps & DispatchProps;

interface AppStateProps {
  network?: Network | null;
  wallet?: Wallet;
}

interface DispatchProps {
  onSelectWallet: (wallet: Wallet) => void;
}

class SelectWallet extends React.PureComponent<Props> {
  handleWalletSelection = (wallet: Wallet) => {
    if (this.props.onSelectWallet) {
      this.props.onSelectWallet(wallet);
    }
  };

  selectStandardWallet = () => this.handleWalletSelection('standard');

  selectLedgerWallet = () => this.handleWalletSelection('ledger');

  render() {
    const { network, wallet } = this.props;

    if (wallet && !network) {
      return spinner;
    }

    return (
      <>
        <h2>Select Wallet</h2>
        <Separator />
        <WalletList>
          <Wallet onClick={this.selectStandardWallet}>
            <Logos>
              <img src={images.wallet.MetaMask} alt='MetaMask' />
              <img src={images.wallet.Safe} alt='Gnosis Safe' />
              <img src={images.wallet.Cipher} alt='Cipher' />
            </Logos>
            <h3>Standard Wallet</h3>
            <p>MetaMask, Safe, Cipher</p>
          </Wallet>
          <Wallet disabled={true} onClick={this.selectLedgerWallet}>
            <Logos>
              <img src={images.wallet.LedgerNano} alt='Ledger Nano' />
            </Logos>
            <h3>Ledger Nano</h3>
            <p />
          </Wallet>
        </WalletList>
      </>
    );
  }
}

const WalletList = styled.div`
  display: grid;
  grid-gap: var(--spacing-normal);
  margin: var(--spacing-normal) 0 0;

  @media (min-width: 801px) {
    grid-template-columns: 1fr 1fr;
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
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    onSelectWallet: wallet => dispatch(initWallet(wallet)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectWallet);
