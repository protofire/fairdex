import { connect } from 'react-redux';

import { getRunningAuctions } from '../../../../store/auctions/selectors';
import AuctionList from '../components/AuctionList';

interface Props {
  auctions: Auction[];
}

function mapStateToProps(state: AppState): Props {
  return {
    auctions: getRunningAuctions(state)
  };
}

export default connect(mapStateToProps)(AuctionList);
