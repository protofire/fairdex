import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Address, DecimalValue } from '../../../components/formatters';
import Spinner from '../../../components/Spinner';
import * as images from '../../../images';
import {
  getClaimableAuctionsCount,
  getCurrentAccount,
  getLiqContribPercentage,
} from '../../../store/blockchain';
import { getBidsCount } from '../../../store/blockchain/buy-orders';
import { getFrt } from '../../../store/blockchain/frt';

import TokenBalance from './TokenBalance';
import WalletCard, { Content, Header, Item } from './WalletCard';

export interface AccountProps {
  claimableCount?: number;
  currentAccount: Address;
  frt?: Token;
  liquidityContribution?: BigNumber;
  pastBids: number;
}

const DEFAULT_DECIMALS = 3;

const AccountInfo = ({
  currentAccount,
  frt,
  pastBids,
  liquidityContribution,
  claimableCount,
}: AccountProps) => (
  <Container data-testid='account-info-card'>
    <Header>
      <Icon>
        <img src={images.wallet.MetaMask} alt='MetaMask' />
      </Icon>
      <HeaderAddress address={currentAccount} />
    </Header>
    <Content>
      <Item>
        <TokenBalance token={frt} decimals={DEFAULT_DECIMALS} />
      </Item>
      <Item>
        {liquidityContribution != null ? (
          <>
            <DecimalValue
              value={liquidityContribution}
              decimals={DEFAULT_DECIMALS}
              postfix='%'
              data-testid='lc-percentage'
            />
            <small>Liquidity Contribution</small>
          </>
        ) : (
          <Spinner size='small' inline />
        )}
      </Item>
      <Item>
        <div data-testid='past-bids-count'>{pastBids}</div>
        <small>Past bids</small>
      </Item>
      <Item>
        <div data-testid='to-claim-count'>{claimableCount}</div>
        <small>To claim</small>
      </Item>
    </Content>
  </Container>
);

const Container = styled(WalletCard)`
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
    claimableCount: getClaimableAuctionsCount(state),
    currentAccount: getCurrentAccount(state),
    frt: getFrt(state),
    liquidityContribution: getLiqContribPercentage(state),
    pastBids: getBidsCount(state),
  };
}

export default connect(mapStateToProps)(AccountInfo);
