import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Address, DecimalValue } from '../../../components/formatters';
import { ZERO } from '../../../contracts/utils';
import * as images from '../../../images';
import { getClaimableAuctionsCount } from '../../../store/blockchain';
import { getBidsCount } from '../../../store/blockchain/buy-orders';
import { getFrt } from '../../../store/blockchain/frt';

import { getLiqContribPercentage } from '../../../store/blockchain/tokens';
import WalletCard, { Content, Header, Item } from './wallet-card';

export interface AccountProps {
  bids: number;
  claimableCount?: number;
  currentAccount: Address;
  frt: Token;
  lc?: BigNumber;
}

const DEFAULT_DECIMALS = 3;

const Account = ({ currentAccount, frt, bids, lc, claimableCount }: AccountProps) => (
  <Container>
    <Header>
      <Icon>
        <img src={images.wallet.MetaMask} alt='MetaMask' />
      </Icon>
      <HeaderAddress address={currentAccount} />
    </Header>
    <Content>
      <Item>
        <DecimalValue value={(frt.balance && frt.balance[1]) || ZERO} decimals={DEFAULT_DECIMALS} />
        <small>{frt.symbol}</small>
      </Item>
      <Item>
        <DecimalValue value={lc} decimals={DEFAULT_DECIMALS} postfix={'%'} />
        <small>Liquidity Contribution</small>
      </Item>
      <Item>
        <div>{bids}</div>
        <small>Bids</small>
      </Item>
      <Item>
        <div>{claimableCount}</div>
        <small>To claim</small>
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
  user-select: none;
`;

function mapStateToProps(state: AppState): AccountProps {
  return {
    currentAccount: state.blockchain.currentAccount,
    bids: getBidsCount(state),
    frt: getFrt(state),
    lc: getLiqContribPercentage(state),
    claimableCount: getClaimableAuctionsCount(state),
  };
}

export default connect(mapStateToProps)(Account);
