import React, { FormEvent, useCallback, useContext, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TransactionReceipt } from 'web3/types';

import { getCurrentAccount } from '../../../../store/blockchain/wallet';
import { showNotification } from '../../../../store/ui/actions';

import Button from '../../../../components/Button';
import DecimalValue from '../../../../components/formatters/DecimalValue';
import Popup from '../../../../components/Popup';
import { ZERO } from '../../../../contracts/utils';
import { getTotalClaimFound } from '../../../../contracts/utils/auctions';
import { loadAvailableTokens } from '../../../../store/blockchain/tokens';
import { ClaimContext } from './ClaimContext';

interface OwnProps {
  auction: Auction;
}

interface AppStateProps {
  currentAccount: Address;
}

interface DispatchProps {
  dispatch: any;
}

const ClaimForm = React.memo(
  ({ auction, currentAccount, dispatch }: OwnProps & AppStateProps & DispatchProps) => {
    const [opened, setOpened] = useState(false);
    const { claiming, doClaim } = useContext(ClaimContext);

    if (!['ended', 'running'].includes(auction.state)) {
      return null;
    }

    if (!auction.unclaimedFunds || auction.unclaimedFunds.lte(0)) {
      return null;
    }

    const showDialog = useCallback(
      () => {
        if (!opened) {
          setOpened(true);
        }
      },
      [opened],
    );

    const hideDialog = useCallback(
      () => {
        if (opened && !claiming) {
          setOpened(false);
        }
      },
      [opened, claiming],
    );

    const handleSubmit = useCallback(
      async (event: FormEvent) => {
        if (event) {
          event.preventDefault();
        }

        if (!claiming && doClaim) {
          doClaim(auction, currentAccount)
            .once('transactionHash', (transactionHash: TransactionHash) => {
              dispatch(
                showNotification(
                  'info',
                  'Claim request sent',
                  <p>
                    Claim transaction has been sent.{' '}
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
                  'Claim confirmed',
                  <p>
                    Claim transaction has been confirmed.{' '}
                    <a href={`https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`} target='_blank'>
                      More info
                    </a>
                  </p>,
                ),
              );

              // Reload token balances and auction list
              dispatch(loadAvailableTokens());

              setOpened(false);
            })
            .once('error', (err: Error) => {
              dispatch(
                showNotification(
                  'error',
                  'Claim failed',
                  <p>
                    {err.message.substring(err.message.lastIndexOf(':') + 1).trim()}
                    <br />
                    Please try again later.
                  </p>,
                ),
              );
            });
        }
      },
      [auction, currentAccount],
    );

    return (
      <Container onClickOutside={hideDialog} onEscPress={hideDialog}>
        {opened && (
          <Content>
            <form onSubmit={handleSubmit}>
              {auction.state === 'ended' && <EndedMessage auction={auction} />}
              <p>{'You can claim'}</p>

              <UnclaimedBalance data-testid='unclaimed-balance'>
                <DecimalValue value={auction.unclaimedFunds} decimals={4} postfix={auction.sellToken} />
              </UnclaimedBalance>

              <Button type='submit' disabled={claiming} autoFocus data-testid='confirm-claim-button'>
                {claiming ? 'Claim in progress...' : 'Claim'}
              </Button>
            </form>
          </Content>
        )}

        {opened ? (
          <Button mode='dark' onClick={hideDialog} data-testid='cancel-claim-button'>
            Cancel
          </Button>
        ) : (
          <Button mode='secondary' onClick={showDialog} disabled={claiming} data-testid='claim-button'>
            Claim
          </Button>
        )}
      </Container>
    );
  },
);

const Container = styled(Popup.Container)``;

const Content = styled(Popup.Content)`
  padding: var(--spacing-narrow);
`;

const UnclaimedBalance = styled.h4`
  margin: var(--spacing-normal) 0;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.25;
  letter-spacing: -0.6px;
  color: var(--color-text-primary);
`;

const EndedMessage = ({ auction }: OwnProps) => {
  const totalBought = getTotalClaimFound(auction);
  const alreadyClaimed =
    totalBought && auction.unclaimedFunds && !totalBought.eq(auction.unclaimedFunds)
      ? totalBought.minus(auction.unclaimedFunds)
      : ZERO;

  return (
    <p>
      {'You bought '}
      <DecimalValue value={totalBought} decimals={4} postfix={auction.sellToken} />
      {' with '}
      <DecimalValue value={auction.buyerBalance} decimals={4} postfix={auction.buyToken} />
      {alreadyClaimed.gt(ZERO) && (
        <>
          {' and you have already claimed '}
          <DecimalValue value={alreadyClaimed} decimals={4} postfix={auction.sellToken} />
        </>
      )}
    </p>
  );
};

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
)(ClaimForm);
