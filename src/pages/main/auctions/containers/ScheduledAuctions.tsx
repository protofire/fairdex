import { connect } from 'react-redux';

import { getScheduledAuctions } from '../../../../store/blockchain';
import AuctionList from '../components/AuctionList';

interface Props {
  auctions: Auction[];
  isLoading?: boolean;
}

function mapStateToProps(state: AppState): Props {
  return {
    auctions: getScheduledAuctions(state),
    isLoading: state.blockchain.auctions == null
  };
}

export default connect(mapStateToProps)(AuctionList);
