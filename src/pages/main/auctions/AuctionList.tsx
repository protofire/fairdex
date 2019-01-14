import React from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';
import styled from 'styled-components';

import Card from '../../../components/Card';
import { EmptyList, ListContainer } from '../../../components/CardList';

import Spinner from '../../../components/Spinner';
import * as images from '../../../images';
import AuctionView from './AuctionView';

export interface AuctionListProps {
  auctions: Auction[];
  isLoading?: boolean;
}

const AuctionList = ({ auctions, isLoading }: AuctionListProps) => (
  <Flipper flipKey={auctions.map(({ auctionIndex }) => auctionIndex).join('-')}>
    {isLoading ? (
      <EmptyList>
        <Spinner size='large' />
      </EmptyList>
    ) : auctions.length > 0 ? (
      <ListContainer>
        {auctions.map(auction => {
          const key = `${auction.sellTokenAddress}-${auction.buyTokenAddress}-${auction.auctionIndex}`;

          return (
            <Flipped key={key} flipId={key}>
              <Item>
                <AuctionView data={auction} />
              </Item>
            </Flipped>
          );
        })}
      </ListContainer>
    ) : (
      <EmptyList>
        <img src={images.auctions.EmptyList} />
        <h3>No auctions found</h3>
      </EmptyList>
    )}
  </Flipper>
);

AuctionList.defaultProps = {
  auctions: [],
  loading: false,
};

const Item = styled.div`
  ${Card} {
    height: 100%;
  }
`;

export default React.memo(AuctionList);
