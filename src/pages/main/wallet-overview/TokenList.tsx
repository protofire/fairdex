import React from 'react';

import { EmptyList, ListContainer } from '../../../components/CardList';

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
    <ListContainer>
      {tokens.map(token => (
        <TokenView key={token.address} data={token} />
      ))}
    </ListContainer>
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

export default React.memo(TokenList);
