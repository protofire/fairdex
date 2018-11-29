import { connect } from 'react-redux';

import { getScheduledAuctions } from '../../../../store/auctions/selectors';
import AuctionList from '../components/AuctionList';

interface Props {
  auctions: Auction[];
}

function mapStateToProps(state: AppState): Props {
  return {
    auctions: getScheduledAuctions(state)
  };
}

export default connect(mapStateToProps)(AuctionList);
