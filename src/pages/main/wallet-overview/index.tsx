import { connect } from 'react-redux';

import { getTokensWithBalance } from '../../../store/blockchain';
import TokenList, { TokenListProps } from './TokenList';

function mapStateToProps(state: AppState): TokenListProps {
  return {
    tokens: getTokensWithBalance(state),
    isLoading: state.blockchain.tokens == null,
  };
}

export default connect(mapStateToProps)(TokenList);
