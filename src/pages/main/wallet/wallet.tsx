import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import Card from '../../../components/Card';
import Cell from './cell';

export interface AccountProps {
  blockchain: BlockchainState;
}

const Account = ({ blockchain }): AccountProps => {
  return (
    <Container>
      <Header />
      <Cell borders={['top', 'right']} />
      <Cell borders={['top']} />
      <Cell borders={['top', 'right']} />
      <Cell borders={['top']} />
    </Container>
  );
};

const Container = styled(Card)`
  padding: 0;
  height: 224px;
  background-image: linear-gradient(49deg, #e5c234, #ffd8be);
  box-shadow: 0 8px 24px 0 rgba(219, 184, 44, 0.5);
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'a a' 'b c' 'd e';
`;

const Header = styled(Cell)`
  grid-area: a;
`;
function mapStateToProps(state: AppState): AccountProps {
  return {
    blockchain: state.blockchain,
  };
}

export default connect(mapStateToProps)(Account);
