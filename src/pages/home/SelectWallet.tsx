import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Separator from '../../components/Separator';
import { connect as connectWallet } from '../../store/wallet/actions';

interface Props {
  actions: {
    onSelectWallet: (wallet: WalletType) => void;
  };
}

class SelectWallet extends React.PureComponent<Props> {
  handleWalletSelection = (wallet: WalletType) => {
    const { actions } = this.props;

    if (actions.onSelectWallet) {
      actions.onSelectWallet(wallet);
    }
  };

  selectStandardWallet = () => this.handleWalletSelection('standard');
  selectLedgerWallet = () => this.handleWalletSelection('ledger');

  render() {
    return (
      <>
        <h2>Select Wallet</h2>
        <Separator />
        <WalletList>
          <Wallet onClick={this.selectStandardWallet}>
            <h3>Standard Wallet</h3>
          </Wallet>
          <Wallet disabled={true} onClick={this.selectLedgerWallet}>
            <h3>Ledger Nano</h3>
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
    transform: translateY(-10%);
  }

  h3 {
    font-size: 32px;
    font-weight: 800;
    font-style: normal;
    line-height: 0.94;
    letter-spacing: normal;
    text-align: center;
    color: var(--color-light-grey-blue);
  }
`;

function mapDispatchToProps(dispatch: any): Props {
  return {
    actions: {
      onSelectWallet: wallet => dispatch(connectWallet(wallet))
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(SelectWallet);
