import React, { AllHTMLAttributes, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { TransactionReceipt } from 'web3/types';

import Button from '../../../components/Button';
import DecimalInput from '../../../components/DecimalInput';
import ExplorerLink from '../../../components/ExplorerLink';
import { DecimalValue } from '../../../components/formatters';
import Popup from '../../../components/Popup';
import { fromDecimal, ZERO } from '../../../contracts/utils';
import { getWalletBalance } from '../../../contracts/utils/tokens';

import { getCurrentAccount, getEthBalance, loadTokens } from '../../../store/blockchain';
import { showNotification } from '../../../store/ui/actions';

type Props = OwnProps & AppStateProps & DispatchProps;

interface OwnProps {
  token: Token;
}

interface AppStateProps {
  currentAccount: Address;
  ethBalance?: BigNumber;
}

interface DispatchProps {
  dispatch: any;
}

const DEFAULT_DECIMALS = 3;

const DepositWithdrawForm = React.memo(({ token, currentAccount, ethBalance = ZERO, dispatch }: Props) => {
  const [amount, setAmount] = useState(ZERO);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showWrapForm, setShowWrapForm] = useState(false);
  const [showUnwrapForm, setShowUnwrapForm] = useState(false);
  const [isWrapping, setIsWrapping] = useState(false);
  const [maxAllowed, setMaxAllowed] = useState(ZERO);

  useEffect(
    () => {
      if (ethBalance.gt(ZERO)) {
        setShowWrapForm(true);
      }

      if (getWalletBalance(token).gt(ZERO)) {
        setShowUnwrapForm(true);
      }
    },
    [token, ethBalance],
  );

  const inputRef = useRef(null);

  const handleInputFocus = useCallback(event => {
    event.target.select();
  }, []);

  const handleClose = useCallback(
    () => {
      if (!loading) {
        setShowDialog(false);
        setAmount(ZERO);
        setMaxAllowed(ZERO);
        setIsWrapping(false);
      }
    },
    [loading],
  );

  const handleWrap = useCallback(
    () => {
      setIsWrapping(true);
      setMaxAllowed(ethBalance);
      handleOpen();
    },
    [ethBalance],
  );

  const handleUnwrap = useCallback(
    () => {
      setMaxAllowed(getWalletBalance(token));
      handleOpen();
    },
    [token],
  );

  const handleOpen = useCallback(() => {
    setShowDialog(true);
  }, []);

  const sendRequest = () => {
    return isWrapping
      ? dx.wrapEther(token).send({
          from: currentAccount,
          value: fromDecimal(amount, 18),
          // TODO: estimated gas
          // TODO: gas price from oracle
        })
      : dx.unwrapEther(token, amount).send({
          from: currentAccount,
          // TODO: estimated gas
          // TODO: gas price from oracle
        });
  };

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      setLoading(true);

      const request = sendRequest();
      if (request) {
        const action = isWrapping ? 'Wrap ETH' : 'Unwrap WETH';

        request
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

            // Reload tokensbalances and allowance
            dispatch(loadTokens());
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
      }
    },
    [token, currentAccount, amount, dispatch],
  );

  return (
    <Container onClickOutside={handleClose} onEscPress={handleClose}>
      {showDialog && (
        <Content>
          <Form onSubmit={handleSubmit} data-testid={`wrap-unwrap-dialog`}>
            <div>
              <h4>Volume</h4>
              <p data-testid={'max-allowed'}>
                {isWrapping ? 'ETH' : token.symbol} (max{' '}
                <DecimalValue value={maxAllowed} decimals={DEFAULT_DECIMALS} />)
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
              data-testid={'confirm-button'}
            >
              {`${isWrapping ? 'Wrap ETH' : 'Unwrap WETH'} ${loading ? 'in progress...' : ''}`}
            </Button>
          </Form>
        </Content>
      )}
      {showDialog ? (
        <Action disabled={loading} onClick={handleClose} data-testid={'cancel-button'}>
          Cancel
        </Action>
      ) : (
        <>
          {showWrapForm && (
            <Action onClick={handleWrap} data-testid={'wrap-button'}>
              Wrap ETH
            </Action>
          )}
          {showWrapForm && showUnwrapForm && ' | '}
          {showUnwrapForm && (
            <Action onClick={handleUnwrap} data-testid={'unwrap-button'}>
              Unwrap
            </Action>
          )}
        </>
      )}
    </Container>
  );
});

const Content = styled(Popup.Content)`
  padding: var(--spacing-narrow);
  width: var(--card-width);
  right: 0;
  transform: translateX(var(--spacing-normal));

  &:after {
    left: calc(85% - var(--box-arrow-height));
    top: calc(var(--box-arrow-height) * -1);
    bottom: unset;
    border-width: 0 calc(var(--box-arrow-height) * 1) var(--box-arrow-height);
  }
`;

const Container = styled(Popup.Container)`
  color: var(--color-text-primary);
  font-size: 0.875rem;
  letter-spacing: -0.4px;

  ${Content} {
    position: absolute;
    top: calc(100% + var(--box-arrow-height) * 1.1);
    right: var(--box-arrow-height);
    bottom: unset;
    z-index: 10001;
  }
`;

const Action = styled.span`
  ${({ disabled }: Pick<AllHTMLAttributes<HTMLSpanElement>, 'disabled'>) => {
    if (disabled) {
      return css`
        color: var(--color-grey);
      `;
    }
  }};

  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
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
    ethBalance: getEthBalance(state),
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
