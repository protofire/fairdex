import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TransactionReceipt } from 'web3/types';

import { updateTokenAllowance } from '../../../store/blockchain/tokens';
import { getCurrentAccount } from '../../../store/blockchain/web3';
import { showNotification } from '../../../store/ui/actions';

import CheckboxToggle from '../../../components/CheckboxToggle';
import ExplorerLink from '../../../components/ExplorerLink';

interface OwnProps {
  token: Token;
  enabled: boolean;
}

interface AppStateProps {
  currentAccount: Address;
}

interface DispatchProps {
  dispatch: any;
}

type Props = OwnProps & AppStateProps & DispatchProps;

const EnableForTradingForm = ({ token, enabled, currentAccount, dispatch }: Props) => {
  const [toggling, setToggling] = useState(false);

  const onChangeHandler = useCallback(
    () => {
      const message = `${enabled ? 'Disable' : 'Enable'} ${token.symbol} for ${
        token.symbol === 'OWL' && !token.tradeable ? 'paying LC' : 'trading'
      }`;

      dx.toggleAllowance(token)
        .send({
          from: currentAccount,
          // TODO: estimated gas
          // TODO: gas price from oracle
        })
        .once('transactionHash', (transactionHash: TransactionHash) => {
          setToggling(true);
          dispatch(
            showNotification(
              'info',
              `${message}`,
              <p>
                {message} transaction has been sent.{' '}
                <ExplorerLink hash={transactionHash}>More info</ExplorerLink>
              </p>,
            ),
          );
        })
        .once('confirmation', (confNumber: number, receipt: TransactionReceipt) => {
          setToggling(false);
          dispatch(
            showNotification(
              'success',
              `${message}`,
              <p>
                {message} transaction has been confirmed.{' '}
                <ExplorerLink hash={receipt.transactionHash}>More info</ExplorerLink>
              </p>,
            ),
          );

          // Reload token balances and allowance
          dispatch(updateTokenAllowance(token));
        })
        .once('error', (err: Error) => {
          setToggling(false);
          dispatch(
            showNotification(
              'error',
              `${message}`,
              <p>
                {err.message.substring(err.message.lastIndexOf(':') + 1).trim()}
                <br />
                Please try again later.
              </p>,
            ),
          );
        });
    },
    [token, currentAccount, dispatch],
  );

  return (
    <Container>
      <Label>
        {token.symbol === 'OWL' && !token.tradeable ? (
          <>
            Enable for paying <abbr title='Liquidity Contribution'>LC</abbr>
          </>
        ) : (
          'Enable for trading'
        )}
      </Label>
      <dd>
        <TradingToggle
          onToggle={onChangeHandler}
          checked={toggling ? null : enabled}
          data-testid={`trading-toggle-${token.address}`}
        />
      </dd>
    </Container>
  );
};

const Label = styled.dt`
  position: relative;
  flex: 1;
  overflow: hidden;
  color: var(--color-greyish);
`;

const Container = styled.div`
  display: flex;
  overflow: hidden;

  ${Label} {
    line-height: 1.5rem;
  }
`;

const TradingToggle = styled(CheckboxToggle)`
  margin-top: 4px;
`;

function mapStateToProps(state: AppState): AppStateProps {
  return {
    currentAccount: getCurrentAccount(state),
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnableForTradingForm);
