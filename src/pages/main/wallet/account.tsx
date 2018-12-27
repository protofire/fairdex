import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import * as images from '../../../images';
import Card from '../../../components/Card';
import Cell, { DecimalContent, IntContent, Description } from './cell';
import { Address } from '../../../components/formatters';
import {
  getBuyTokens,
  getFilteredClaimableAuctions,
  getFilteredMyTokensAuctions,
  getSellTokens,
} from '../../../store/blockchain';

export interface AccountProps {
  currentAccount: Address;
  bids: number;
  feeRatio?: BigNumber;
  toClaim?: number;
}

const DEFAULT_DECIMALS = 3;

const Account = ({ currentAccount, bids, feeRatio, toClaim }): AccountProps => (
  <Container>
    <Header>
      <WalletIcon>
        <img src={images.wallet.MetaMask} alt='MetaMask' />
      </WalletIcon>
      <StyledAddress address={currentAccount} />
    </Header>
    <Cell borders={['top', 'right']}>
      <DecimalContent value={12.5} decimals={DEFAULT_DECIMALS} />
      <Description>MGN</Description>
    </Cell>
    <Cell borders={['top']}>
      <DecimalContent value={feeRatio} decimals={DEFAULT_DECIMALS} postfix={'%'} />
      <Description>Fee level</Description>
    </Cell>
    <Cell borders={['top', 'right']}>
      <IntContent>{bids}</IntContent>
      <Description>Bids</Description>
    </Cell>
    <Cell borders={['top']}>
      <IntContent>{toClaim}</IntContent>
      <Description>To claim</Description>
    </Cell>
  </Container>
);

const Container = styled(Card)`
  height: 336px;
  background-image: linear-gradient(37deg, #8bc6ec, #a8f6e4);
  box-shadow: 0 8px 24px 0 rgba(139, 198, 236, 0.5);
  display: grid;
  padding: 0;
  grid-template-rows: 3fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'a a' 'b c' 'd e';
`;

const Header = styled(Cell)`
  grid-area: a;
  justify-content: space-evenly;
`;

const WalletIcon = styled.div`
  width: 80px;
  height: 80px;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 80px;
  text-align: center;
  padding-top: 15px;
`;

const StyledAddress = styled(Address)`
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 2.14;
  letter-spacing: -0.4px;
  color: var(--color-text-primary);
`;

function mapStateToProps(state: AppState): AccountProps {
  const claimableAuctions = getFilteredClaimableAuctions(state);
  const bids = state.blockchain.buyOrders ? state.blockchain.buyOrders.length : 0;
  const { currentAccount } = state.blockchain;
  return {
    currentAccount,
    bids,
    feeRatio: state.blockchain.feeRatio,
    toClaim: claimableAuctions.length,
  };
}

export default connect(mapStateToProps)(Account);
