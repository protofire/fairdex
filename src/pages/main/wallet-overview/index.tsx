import { connect } from 'react-redux';

import { getFilteredTokens, getOwlAddress, isOwlListed } from '../../../store/blockchain';
import TokenList, { TokenListProps } from './TokenList';

function mapStateToProps(state: AppState): TokenListProps {
  return {
    tokens: getFilteredTokens(state),
    owlAddress: getOwlAddress(state),
    owlListed: isOwlListed(state),
    isLoading: state.blockchain.tokens == null,
  };
}

export default connect(mapStateToProps)(TokenList);
