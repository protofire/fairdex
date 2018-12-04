import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { getRunningAuctions } from '../../../../store/auctions/selectors';
import { showInfoMessage } from '../../../../store/ui/actions';
import AuctionList from '../components/AuctionList';

interface Props {
  auctions: Auction[];
}

interface DispatchProps {
  onBid: () => void;
}

function mapStateToProps(state: AppState): Props {
  return {
    auctions: getRunningAuctions(state)
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
