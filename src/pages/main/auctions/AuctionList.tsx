import React, { useCallback, useState } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';
import { connect } from 'react-redux';

import { EmptyList, ListContainer } from '../../../components/CardList';

import Spinner from '../../../components/Spinner';
import * as images from '../../../images';
import { hideAuctionDetail } from '../../../store/ui/actions';
import AuctionDetail from './AuctionDetail';
import AuctionView from './AuctionView';

export interface AuctionListProps {
  auctions: Auction[];
  isLoading?: boolean;
}

interface DispatchProps {
  dispatch: any;
}

type Props = AuctionListProps & DispatchProps;

const AuctionList = ({ auctions, isLoading, dispatch }: Props) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleCardClick = useCallback(() => {
    setIsDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback(() => {
    setIsDetailOpen(false);
    dispatch(hideAuctionDetail());
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

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    dispatch,
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(AuctionList);
