import React from 'react';
import styled, { css } from 'styled-components';
import Card from '../../../components/Card';
import { DecimalValue } from '../../../components/formatters';

const WalletCard = styled(Card)`
  padding: 0;
  box-shadow: 0 8px 24px 0 rgba(139, 198, 236, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  padding: var(--spacing-normal);
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0px;
  height: 100%;
`;

export const Item = styled.div`
  text-align: center;
  padding: var(--spacing-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  min-width: 0;

  &:nth-child(odd) {
    border-left: none;
  }

  & > *:nth-child(1) {
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
  }

  & > *:nth-child(2) {
    font-size: 12px;
    color: var(--color-text-primary);
  }
`;

export default WalletCard;
