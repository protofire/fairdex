import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Card from '../../../components/Card';
import { DecimalValue } from '../../../components/formatters';
import arrowImage from '../../../images/arrow.svg';
import { getTokensWithBalance, getTopBalances } from '../../../store/blockchain';
import { getTotalBalance } from '../../contracts/utils/tokens';
import WalletCard, { Content, Header, Item } from './wallet-card';

interface StateProps {
  tokens: Token[];
  topBalances: Token[];
}

type WalletProps = StateProps & RouteComponentProps;

const DEFAULT_DECIMALS = 3;

const Account = ({ tokens, topBalances }): WalletProps => {
  return (
    <Container>
      <WalletHeader>
        <div>Wallet</div>
        <ViewAllCurrencies to='/running'>VIEW ALL {tokens.length} CURRENCIES &#x279C;</ViewAllCurrencies>
      </WalletHeader>
      <Content>
        <Item>
          <DecimalValue value={topBalances[0].totalBalance} decimals={DEFAULT_DECIMALS} />
          <div>{topBalances[0].symbol}</div>
        </Item>
        <Item>
          <DecimalValue value={topBalances[1].totalBalance} decimals={DEFAULT_DECIMALS} />
          <div>{topBalances[1].symbol}</div>
        </Item>
        <Item>
          <DecimalValue value={topBalances[2].totalBalance} decimals={DEFAULT_DECIMALS} />
          <div>{topBalances[2].symbol}</div>
        </Item>
        <Item>
          <DecimalValue value={topBalances[3].totalBalance} decimals={DEFAULT_DECIMALS} />
          <div>{topBalances[3].symbol}</div>
        </Item>
      </Content>
    </Container>
  );
};

const Container = styled(WalletCard)`
  height: 224px;
  background-image: linear-gradient(49deg, #e5c234, #ffd8be);
`;

const ViewAllCurrencies = styled(NavLink)``;

const WalletHeader = styled(Header)`
  height: 79px;
  &&& > div:nth-of-type(1) {
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 2.14;
    letter-spacing: -0.4px;
    color: var(--color-text-primary);
  }

  & > ${ViewAllCurrencies} {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: -0.3px;
    color: rgba(48, 59, 62, 0.42);
  }
`;

function mapStateToProps(state: AppState): WalletProps {
  const tokens = getTokensWithBalance(state);
  const topBalances = getTopBalances(state);

  return {
    tokens,
    topBalances,
  };
}

export default withRouter(connect(mapStateToProps)(Account));
