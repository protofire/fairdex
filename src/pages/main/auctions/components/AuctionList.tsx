import React from 'react';
import styled from 'styled-components';

import Spinner from '../../../../components/Spinner';
import * as images from '../../../../images';
import AuctionView from './AuctionView';

export interface AuctionListProps {
  auctions: Auction[];
  isLoading?: boolean;
}

const AuctionList = ({ auctions, isLoading }: AuctionListProps) =>
  isLoading ? (
    <EmptyList>
      <Spinner size='large' />
    </EmptyList>
  ) : auctions.length > 0 ? (
    <Container>
      {auctions.map(auction => (
        <AuctionView key={`${auction.sellToken}-${auction.buyToken}-${auction.auctionIndex}`} data={auction} />
      ))}
    </Container>
  ) : (
    <EmptyList>
      <img src={images.auctions.EmptyList} />
      <h3>No auctions found</h3>
    </EmptyList>
  );

AuctionList.defaultProps = {
  auctions: [],
  loading: false
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

export default React.memo(AuctionList);
