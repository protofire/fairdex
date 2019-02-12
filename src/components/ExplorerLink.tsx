import React from 'react';
import { connect } from 'react-redux';

import { getExplorerLink } from '../store/blockchain/web3';

interface OwnProps {
  hash: TransactionHash;
  children: React.ReactNode;
}

interface StateProps {
  transactionUrl: string;
}

const ExplorerLink = ({ children, transactionUrl }: OwnProps & StateProps) => (
  <a href={transactionUrl} target='_blank'>
    {children}
  </a>
);

function mapStateToProps(state: AppState, props: OwnProps): StateProps {
  return {
    transactionUrl: getExplorerLink(props.hash)(state),
  };
}

export default connect(mapStateToProps)(ExplorerLink);
