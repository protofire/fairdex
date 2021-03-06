import React, { FormEvent, useCallback, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TransactionReceipt } from 'web3/types';

import { ZERO } from '../../../contracts/utils';
import { getCurrentAccount } from '../../../store/blockchain';
import { showNotification } from '../../../store/ui/actions';

import { DecimalValue } from '../../../components/formatters';

import Button from '../../../components/Button';
import DecimalInput from '../../../components/DecimalInput';
import ExplorerLink from '../../../components/ExplorerLink';
import Popup from '../../../components/Popup';
import { getDxBalance, getWalletBalance } from '../../../contracts/utils/tokens';

type Props = OwnProps & AppStateProps & DispatchProps;

interface OwnProps {
  token: Token;
  action: 'Deposit' | 'Withdraw';
}

interface AppStateProps {
  currentAccount: Address;
}

interface DispatchProps {
  dispatch: any;
}

const DEFAULT_DECIMALS = 3;
const DEPOSIT = 'Deposit';

const DepositWithdrawForm = React.memo(({ token, action, currentAccount, dispatch }: Props) => {
  const [amount, setAmount] = useState(ZERO);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const dxMethod = action === DEPOSIT ? 'depositToken' : 'withdrawToken';

  const inputRef = useRef(null);
  const handleInputFocus = useCallback(event => {
    event.target.select();
  }, []);

  const handleClose = useCallback(
    () => {
      if (!loading) {
        setShowDialog(false);
        setAmount(ZERO);
      }
    },
    [loading],
  );

  const handleOpen = useCallback(() => {
    setShowDialog(true);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      setLoading(true);

      dx[dxMethod](token, amount)
        .send({
          from: currentAccount,
          // TODO: estimated gas
          // TODO: gas price from oracle
        })
        .once('transactionHash', (transactionHash: TransactionHash) => {
          dispatch(
            showNotification(
              'info',
              `${action} request sent`,
              <p>
                {action} transaction has been sent.{' '}
                <ExplorerLink hash={transactionHash}>More info</ExplorerLink>
              </p>,
            ),
          );
        })
        .once('confirmation', (confNumber: number, receipt: TransactionReceipt) => {
          dispatch(
            showNotification(
              'success',
              `${action} confirmed`,
              <p>
                {action} has been confirmed.{' '}
                <ExplorerLink hash={receipt.transactionHash}>More info</ExplorerLink>
              </p>,
            ),
          );

          setLoading(false);
          handleClose();
        })
        .once('error', (err: Error) => {
          dispatch(
            showNotification(
              'error',
              `${action} failed`,
              <p>
                {err.message.substring(err.message.lastIndexOf(':') + 1).trim()}
                <br />
                Please try again later.
              </p>,
            ),
          );

          setLoading(false);
        });
    },
    [token, action, dxMethod, currentAccount, amount, dispatch],
  );

  const maxAllowed = useMemo(() => (action === DEPOSIT ? getWalletBalance(token) : getDxBalance(token)), [
    action,
    token,
  ]);
  const isActionDisabled = useMemo(() => action === DEPOSIT && token.allowance && token.allowance.lte(ZERO), [
    action,
    token,
  ]);

  return (
    <Container
      onClickOutside={handleClose}
      onEscPress={handleClose}
      data-testid={`${action.toLocaleLowerCase()}-${token.address}-dialog`}
    >
      {showDialog && (
        <Content>
          <Form onSubmit={handleSubmit}>
            <div>
              <h4>Volume</h4>
              <p data-testid={`${action.toLocaleLowerCase()}-${token.address}-max-allowed`}>
                {token.symbol} (max <DecimalValue value={maxAllowed} decimals={DEFAULT_DECIMALS} />)
              </p>
            </div>
            <DecimalInput
              value={amount.toString(10)}
              ref={inputRef}
              onValueChange={setAmount}
              onFocus={handleInputFocus}
              autoFocus={true}
            />
            <Button
              type='submit'
              disabled={loading || amount.lte(ZERO) || amount.gt(maxAllowed)}
              data-testid={`confirm-${action.toLocaleLowerCase()}-${token.address}-button`}
            >
              {loading ? `${action} in progress...` : 'Confirm'}
            </Button>
          </Form>
        </Content>
      )}
      {showDialog ? (
        <Button
          mode='dark'
          onClick={handleClose}
          data-testid={`cancel-${action.toLocaleLowerCase()}-${token.address}-button`}
        >
          Cancel
        </Button>
      ) : (
        <Button
          mode='secondary'
          onClick={handleOpen}
          data-testid={`${action.toLocaleLowerCase()}-${token.address}-button`}
          disabled={isActionDisabled}
        >
          {action}
        </Button>
      )}
    </Container>
  );
});

const Container = styled(Popup.Container)``;

const Content = styled(Popup.Content)`
  padding: var(--spacing-narrow);
`;

const Form = styled.form`
  width: 100%;
  display: inline-grid;
  grid-template-columns: 1fr;
  grid-gap: var(--spacing-narrow);
  padding: var(--spacing-narrow);
  justify-items: center;

  h4 {
    margin: 0;
    font-weight: bold;
    line-height: 1.25;
    letter-spacing: -0.4px;
    color: var(--color-text-primary);
  }

  p {
    margin: 0;
    font-size: 0.75rem;
    letter-spacing: -0.3px;
    color: var(--color-text-secondary);
    padding: 0;
  }

  div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
  }
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
)(DepositWithdrawForm);
