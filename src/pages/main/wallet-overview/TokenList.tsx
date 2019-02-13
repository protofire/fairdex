import React from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';

import { EmptyList, ListContainer } from '../../../components/CardList';

import Spinner from '../../../components/Spinner';
import * as images from '../../../images';
import TokenView from './TokenView';

export interface TokenListProps {
  tokens: Token[];
  isLoading?: boolean;
}

const TokenList = ({ tokens, isLoading }: TokenListProps) => {
  return (
    <Flipper flipKey={tokens.map(({ address }) => address.substr(address.length - 8)).join('-')}>
      {isLoading ? (
        <EmptyList>
          <Spinner size='large' />
        </EmptyList>
      ) : tokens.length > 0 ? (
        <ListContainer>
          {tokens.map(token => (
            <Flipped key={token.address} flipId={token.address}>
              <div>
                <TokenView data={token} />
              </div>
            </Flipped>
          ))}
        </ListContainer>
      ) : (
        <EmptyList>
          <img src={images.auctions.EmptyList} />
          <h3>No tokens with balance found</h3>
        </EmptyList>
      )}
    </Flipper>
  );
};

TokenList.defaultProps = {
  tokens: [],
  loading: false,
};

export default TokenList;
