import React, { useCallback, useState } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';

import { EmptyList, ListContainer } from '../../../components/CardList';

import Spinner from '../../../components/Spinner';
import * as images from '../../../images';
import AuctionDetail from './AuctionDetail';
import AuctionView from './AuctionView';

export interface AuctionListProps {
  auctions: Auction[];
  isLoading?: boolean;
}

const AuctionList = ({ auctions, isLoading }: AuctionListProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [auctoinDetail, setAuctionDetail] = useState<Auction | null>(null);

  const handleCardClick = (auction: Auction) => {
    setAuctionDetail(auction);
    setIsDetailOpen(true);
  };

  const handleDetailClose = useCallback(() => {
    setIsDetailOpen(false);
    setAuctionDetail(null);
  }, []);

  return (
    <>
      <Flipper flipKey={auctions.map(({ auctionIndex }) => auctionIndex).join('-')}>
        {isLoading ? (
          <EmptyList>
            <Spinner size='large' data-testid={'auction-list-spinner'} />
          </EmptyList>
        ) : auctions.length > 0 ? (
          <ListContainer>
            {auctions.map(auction => {
              const key = `${auction.sellTokenAddress}-${auction.buyTokenAddress}-${auction.auctionIndex}`;

              return (
                <Flipped key={key} flipId={key}>
                  <div>
                    <AuctionView data={auction} onCardClick={handleCardClick} />
                  </div>
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
      <AuctionDetail
        auction={auctoinDetail}
        isOpen={isDetailOpen}
        onClickOutside={handleDetailClose}
        onEscPress={handleDetailClose}
      />
    </>
  );
};

AuctionList.defaultProps = {
  auctions: [],
  loading: false,
};

export default React.memo(AuctionList);
