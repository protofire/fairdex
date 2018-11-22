import { connect } from 'react-redux';
import AuctionList from '../components/AuctionList';

interface Props {
  auctions: Auction[];
}

function mapStateToProps(state: AppState): Props {
  return {
    auctions: state.auctions.ended
  };
}

export default connect(mapStateToProps)(AuctionList);
