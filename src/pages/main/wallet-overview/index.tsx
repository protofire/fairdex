import { connect } from 'react-redux';

import { getFilteredTokens } from '../../../store/blockchain';
import TokenList, { TokenListProps } from './TokenList';

function mapStateToProps(state: AppState): TokenListProps {
  return {
    tokens: getFilteredTokens(state),
    isLoading: state.blockchain.tokens == null,
  };
}

export default connect(mapStateToProps)(TokenList);
