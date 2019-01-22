import React, { FormEvent, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TransactionReceipt } from 'web3/types';

import * as utils from '../../../contracts/utils';
import { getCurrentAccount, loadTokens } from '../../../store/blockchain';
import { showNotification } from '../../../store/ui/actions';

import { DecimalValue } from '../../../components/formatters';

import Button from '../../../components/Button';
import DecimalInput from '../../../components/DecimalInput';
import Popup from '../../../components/Popup';

type Props = OwnProps & AppStateProps & DispatchProps;

interface OwnProps {
  token: Token;
}

interface AppStateProps {
  currentAccount: Address;
}

interface DispatchProps {
  dispatch: any;
}

interface State {
  amount: BigNumber;
  loading: boolean;
  showDialog: boolean;
}

const { ZERO } = utils;
const DEFAULT_DECIMALS = 3;

const DepositForm = React.memo(({ token, currentAccount, dispatch }: Props) => {
  const [amount, setAmmount] = useState(ZERO);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const inputRef = React.createRef<HTMLInputElement>();
  const handleInputFocus: React.FocusEventHandler<HTMLInputElement> = event => {
    event.target.select();
  };

  const handleClose = () => {
    if (!loading) {
      setShowDialog(false);
      setAmmount(ZERO);
    }
  };

  const handleOpen = () => {
    setShowDialog(true);
  };

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      setLoading(true);

      dx.depositToken(token, amount)
        .send({
          from: currentAccount,
          // TODO: estimated gas
          // TODO: gas price from oracle
        })
        .once('transactionHash', (transactionHash: TransactionHash) => {
          dispatch(
            showNotification(
              'info',
              'Deposit request sent',
              <p>
                Deposit transaction has been sent.{' '}
                <a href={`https://rinkeby.etherscan.io/tx/${transactionHash}`} target='_blank'>
                  More info
                </a>
              </p>,
            ),
          );
        })
        .once('confirmation', (confNumber: number, receipt: TransactionReceipt) => {
          dispatch(
            showNotification(
              'success',
              'Deposit confirmed',
              <p>
                Deposit has been confirmed.{' '}
                <a href={`https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`} target='_blank'>
                  More info
                </a>
              </p>,
            ),
          );

          // Reload tokensbalances and allowance
          dispatch(loadTokens());
          setLoading(false);
          handleClose();
        })
        .once('error', (err: Error) => {
          dispatch(
            showNotification(
              'error',
              'Deposit failed',
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
    [token, currentAccount, amount, dispatch],
  );

  const tokenBalanceInWallet = utils.token.getWalletBalance(token);

  return (
    <Container onClickOutside={handleClose} onEscPress={handleClose}>
      {showDialog && (
        <Content>
          <Form onSubmit={handleSubmit}>
            <div>
              <h4>Volume</h4>
              <p>
                {token.symbol} (max <DecimalValue value={tokenBalanceInWallet} decimals={DEFAULT_DECIMALS} />)
              </p>
            </div>
            <DecimalInput
              value={amount.toString(10)}
              ref={inputRef}
              onValueChange={setAmmount}
              onFocus={handleInputFocus}
              autoFocus={true}
            />
            <Button type='submit' disabled={loading || amount.lte(ZERO) || amount.gt(tokenBalanceInWallet)}>
              {loading ? 'Bid in progress...' : 'Confirm'}
            </Button>
          </Form>
        </Content>
      )}
      {showDialog ? (
        <Button mode='dark' onClick={handleClose}>
          Cancel
        </Button>
      ) : (
        <Button
          mode='secondary'
          onClick={handleOpen}
          data-testid={`${token.address}-deposit-button`}
          disabled={token.allowance ? token.allowance.lte(ZERO) : true}
        >
          Deposit
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

function mapStateToProps(state: AppState, props: OwnProps): AppStateProps {
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
)(DepositForm);
