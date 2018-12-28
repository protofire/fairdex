import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { Address, DecimalValue } from '../../../components/formatters';
import * as images from '../../../images';
import {
  getBuyTokens,
  getFilteredClaimableAuctions,
  getFilteredMyTokensAuctions,
  getSellTokens,
} from '../../../store/blockchain';
import { getBidsCount } from '../../../store/blockchain/buy-orders';
import { getFrt } from '../../../store/blockchain/frt';

import WalletCard, { Content, Header, Item } from './wallet-card';

export interface AccountProps {
  currentAccount: Address;
  frt: Token;
  bids: number;
  feeRatio?: BigNumber;
  toClaim?: number;
}

const DEFAULT_DECIMALS = 3;

const Account = ({ currentAccount, frt, bids, feeRatio, toClaim }): AccountProps => (
  <Container>
    <Header>
      <Icon>
        <img src={images.wallet.MetaMask} alt='MetaMask' />
      </Icon>
      <HeaderAddress address={currentAccount} />
    </Header>
    <Content>
      <Item>
        <DecimalValue value={frt.balance} decimals={DEFAULT_DECIMALS} />
        <div>{frt.symbol}</div>
      </Item>
      <Item>
        <DecimalValue value={feeRatio} decimals={DEFAULT_DECIMALS} postfix={'%'} />
        <div>Fee level</div>
      </Item>
      <Item>
        <div>{bids}</div>
        <div>Bids</div>
      </Item>
      <Item>
        <div>{toClaim}</div>
        <div>To claim</div>
      </Item>
    </Content>
  </Container>
);

const Container = styled(WalletCard)`
  height: 336px;
  background-image: linear-gradient(37deg, #8bc6ec, #a8f6e4);
`;

const HeaderAddress = styled(Address)`
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 2.14;
  letter-spacing: -0.4px;
  color: var(--color-text-primary);
`;

const Icon = styled.div`
  width: 80px;
  height: 80px;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 80px;
  text-align: center;
  padding-top: 15px;
`;

function mapStateToProps(state: AppState): AccountProps {
  const claimableAuctions = getFilteredClaimableAuctions(state);
  const bids = getBidsCount(state);
  const frt = getFrt(state);
  const { currentAccount } = state.blockchain;

  return {
    currentAccount,
    frt,
    bids,
    feeRatio: state.blockchain.feeRatio,
    toClaim: claimableAuctions.length,
  };
}

export default connect(mapStateToProps)(Account);
