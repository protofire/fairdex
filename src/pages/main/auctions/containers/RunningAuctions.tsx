import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { getRunningAuctions } from '../../../../store/blockchain';
import { showInfoMessage } from '../../../../store/ui/actions';
import AuctionList from '../components/AuctionList';

interface Props {
  auctions: Auction[];
  isLoading?: boolean;
}

interface DispatchProps {
  onBid: () => void;
}

function mapStateToProps(state: AppState): Props {
  return {
    auctions: getRunningAuctions(state),
    isLoading: state.blockchain.auctions == null
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    onBid: () => dispatch(showInfoMessage('info', 'Cannot bid', 'This is a nice text content'))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuctionList);
