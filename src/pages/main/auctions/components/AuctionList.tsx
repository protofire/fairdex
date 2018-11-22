import React from 'react';
import styled from 'styled-components';
import AuctionCard from './Auction';

interface Props {
  auctions: Auction[];
}

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
  grid-gap: var(--spacing-wide);
`;

export default React.memo(function AuctionList(props: Props) {
  return (
    <Root>
      {props.auctions.map(auction => {
        return <AuctionCard key={auction.auctionIndex} data={auction} />;
      })}
    </Root>
  );
});
