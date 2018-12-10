import { connect } from 'react-redux';

import { getScheduledAuctions } from '../../../../store/blockchain';
import AuctionList, { AuctionListProps } from '../components/AuctionList';

function mapStateToProps(state: AppState): AuctionListProps {
  return {
    auctions: getScheduledAuctions(state),
    isLoading: state.blockchain.auctions == null
  };
}

export default connect(mapStateToProps)(AuctionList);
