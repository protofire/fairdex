import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Address, DecimalValue } from '../../../components/formatters';
import Icons from '../../../components/icons';
import Spinner from '../../../components/Spinner';
import * as images from '../../../images';
import {
  getClaimableAuctionsCount,
  getCurrentAccount,
  getLiqContribPercentage,
  getNetworkType,
} from '../../../store/blockchain';
import { getBidsCount } from '../../../store/blockchain/buy-orders';
import { getFrt } from '../../../store/blockchain/fee';

import TokenBalance from './TokenBalance';
import WalletCard, { Content, Header, Item } from './WalletCard';

export interface AccountProps {
  claimableCount?: number;
  currentAccount: Address;
  currentNetwork: Network | null;
  frt?: Token;
  liquidityContribution?: BigNumber;
  pastBids?: number;
}

const DEFAULT_DECIMALS = 3;

const AccountInfo = ({
  currentAccount,
  currentNetwork,
  frt,
  pastBids,
  liquidityContribution,
  claimableCount,
}: AccountProps) => {
  return (
    <Container data-testid='account-info-card'>
      <Header>
        <Icon>
          {window.ethereum.isSafe ? (
            <img src={images.wallet.Safe} alt='Safe' />
          ) : window.ethereum.isMetaMask ? (
            <img src={images.wallet.MetaMask} alt='MetaMask' />
          ) : (
            <Icons.Wallet />
          )}
        </Icon>
        <HeaderAddress address={currentAccount} />
        <NetworkName title={currentNetwork ? `Connected to ${currentNetwork} network` : ''}>
          {currentNetwork}
        </NetworkName>
      </Header>
      <Content>
        <Item>
          <TokenBalance
            token={frt}
            decimals={DEFAULT_DECIMALS}
            description='Magnolia (MGN) tokens reduce your liquidity contribution.The more MGN you hold as a percentage of the total MGN market volume, the lower your liquidity contribution is (if within the relevant percentages).'
          />
        </Item>
        <Item title='On the DutchX Protocol, a liquidity contribution is levied on users in place of traditional fees. These do not go to us or an operator. Liquidity contributions are committed to the next running auction for the respective auction pair and are thus redistributed to you and all other users of the DutchX Protocol! This incentivises volume and use of the Protocol.'>
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
          {pastBids != null ? (
          <>
            <div data-testid='past-bids-count'>{pastBids}</div>
            <small>Past bids</small>
          </>
        ) : (
          <Spinner size='small' inline />
        )}
      </Item>
      <Item>
        {claimableCount != null ? (
          <>
            <div data-testid='to-claim-count'>{claimableCount}</div>
            <small>To claim</small>
          </>
        ) : (
          <Spinner size='small' inline />
        )}
        </Item>
      </Content>
    </Container>
  );
};

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
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const NetworkName = styled.div`
  position: relative;
  font-size: 12px;
  border-bottom: 1px dashed black;
  text-transform: capitalize;

  &:before {
    position: absolute;
    width: 10px;
    height: 10px;
    bottom: calc(50% - 5px);
    left: -15px;
    content: '';
    background: var(--color-connected);
    border-radius: 50%;
  }
`;

function mapStateToProps(state: AppState): AccountProps {
  return {
    claimableCount: state.blockchain.auctions && getClaimableAuctionsCount(state),
    currentAccount: getCurrentAccount(state),
    currentNetwork: getNetworkType(state),
    frt: getFrt(state),
    liquidityContribution: getLiqContribPercentage(state),
    pastBids: getBidsCount(state),
  };
}

export default connect(mapStateToProps)(AccountInfo);
