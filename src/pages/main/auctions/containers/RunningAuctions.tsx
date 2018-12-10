import React from 'react';
import { connect } from 'react-redux';

import { getRunningAuctions } from '../../../../store/blockchain';
import AuctionList, { AuctionListProps } from '../components/AuctionList';

function mapStateToProps(state: AppState): AuctionListProps {
  return {
    auctions: getRunningAuctions(state),
    isLoading: state.blockchain.auctions == null,
  };
}

export default connect(mapStateToProps)(AuctionList);
