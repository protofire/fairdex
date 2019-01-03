import React from 'react';
import styled from 'styled-components';

import Spinner from '../../../components/Spinner';
import * as images from '../../../images';
import TokenView from './TokenView';

export interface TokenListProps {
  tokens: Token[];
  isLoading?: boolean;
}

const TokenList = ({ tokens, isLoading }: TokenListProps) =>
  isLoading ? (
    <EmptyList>
      <Spinner size='large' />
    </EmptyList>
  ) : tokens.length > 0 ? (
    <Container>
      {tokens.map(token => (
        <TokenView key={token.address} data={token} />
      ))}
    </Container>
  ) : (
    <EmptyList>
      <img src={images.auctions.EmptyList} />
      <h3>No tokens with balance found</h3>
    </EmptyList>
  );

TokenList.defaultProps = {
  tokens: [],
  loading: false,
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
  grid-gap: var(--spacing-normal);
`;

const EmptyList = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - var(--header-height) - var(--spacing-normal) * 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  user-select: none;

  img {
    width: 48px;
    height: 48px;
  }

  h3 {
    padding: var(--spacing-text) 0;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 2.14;
    letter-spacing: -0.4px;
    text-align: center;
    color: var(--color-grey);
  }
`;

export default React.memo(TokenList);
