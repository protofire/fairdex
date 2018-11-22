import React from 'react';
import styled from 'styled-components';

import Card from '../../../components/Card';

const Container = styled.div`
  display: grid;
  padding: var(--spacing-normal);
  gap: var(--spacing-normal);
  height: 400px;
`;

const Account = styled(Card)`
  height: 336px;
  background-image: linear-gradient(37deg, #8bc6ec, #a8f6e4);
  box-shadow: 0 8px 24px 0 rgba(139, 198, 236, 0.5);
`;

const Wallet = styled(Card)`
  height: 224px;
  background-image: linear-gradient(49deg, #e5c234, #ffd8be);
  box-shadow: 0 8px 24px 0 rgba(219, 184, 44, 0.5);
`;

export default () => (
  <Container>
    <Account />
    <Wallet />
  </Container>
);
