import { connect } from 'react-redux';

import { getEndedAuctions } from '../../../../store/auctions/selectors';
import AuctionList from '../components/AuctionList';

interface Props {
  auctions: Auction[];
}

function mapStateToProps(state: AppState): Props {
  return {
    auctions: getEndedAuctions(state)
  };
}

export default connect(mapStateToProps)(AuctionList);
