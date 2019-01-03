import React from 'react';
import styled, { css } from 'styled-components';

import Card from '../../../components/Card';
import Account from './account';
import Wallet from './wallet';

const Container = styled.div`
  display: grid;
  padding: var(--spacing-normal);
  gap: var(--spacing-normal);
`;

export default () => (
  <Container>
    <Account />
    <Wallet />
  </Container>
);
