import { connect } from 'react-redux';

import { getEndedAuctions } from '../../../../store/blockchain';
import AuctionList from '../components/AuctionList';

interface Props {
  auctions: Auction[];
  isLoading?: boolean;
}

function mapStateToProps(state: AppState): Props {
  return {
    auctions: getEndedAuctions(state),
    isLoading: state.blockchain.auctions == null
  };
}

export default connect(mapStateToProps)(AuctionList);
