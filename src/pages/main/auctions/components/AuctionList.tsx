import React from 'react';
import styled from 'styled-components';
import AuctionCard from './Auction';

interface Props {
  auctions: Auction[];
}

const AuctionList = ({ auctions }: Props) => (
  <Container>
    {auctions.map(auction => (
      <AuctionCard key={auction.auctionIndex} data={auction} />
    ))}
  </Container>
);

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
  grid-gap: var(--spacing-normal);
`;

export default React.memo(AuctionList);
