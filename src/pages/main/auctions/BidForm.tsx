import BigNumber from 'bignumber.js';
import { ellipsis } from 'polished';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Tooltip from '../../../components/Tooltip';

import DecimalInput from '../../../components/DecimalInput';
import { DecimalValue } from '../../../components/formatters';
import Panel from '../../../components/Panel';
import * as utils from '../../../contracts/utils';
import { getCurrentAccount, getCurrentFeeRatio, getToken } from '../../../store/blockchain';
import { showNotification } from '../../../store/ui/actions';

type Props = OwnProps & AppStateProps & DispatchProps;

interface OwnProps {
  auction: Auction;
}

interface AppStateProps {
  currentAccount: Address;
  buyToken?: Token;
  sellToken?: Token;
  feeRate: BigNumber;
}

interface DispatchProps {
  dispatch: any;
}

interface State {
  amount: BigNumber;
  currentStep?: 1 | 2 | 3;
  loading?: boolean;
  showDialog?: boolean;
}

const { ZERO } = utils;

class BidForm extends React.PureComponent<Props, State> {
  state: State = { amount: ZERO };

  getInitialStep = () => {
    return utils.auction.isAbovePriorClosingPrice(this.props.auction) ? 1 : 2;
  };

  handleAmountChange = (amount: BigNumber) => {
    this.setState({ amount });
  };

  handleClose = () => {
    if (!this.state.loading) {
      this.setState({ showDialog: false, currentStep: undefined, amount: ZERO });
    }
  };

  handleClickOutside = () => {
    this.handleClose();
  };

  handleInputFocus: React.FocusEventHandler<HTMLInputElement> = event => {
    event.target.select();
  };

  handleSubmit = (event: any) => {
    const { amount } = this.state;

    if (amount && amount.isGreaterThan(ZERO)) {
      const { auction, buyToken, currentAccount } = this.props;

      this.setState({ loading: true });

      dx.postBuyOrder(
        auction.sellTokenAddress,
        auction.buyTokenAddress,
        auction.auctionIndex,
        utils.fromDecimal(amount, buyToken ? buyToken.decimals : 18),
      )
        .send({
          from: currentAccount,
          // TODO: gasPrice
          // TODO: nonce
        })
        .once('transactionHash', transactionHash => {
          this.props.dispatch(
            showNotification(
              'info',
              'Transaction sent',
              <p>
                Bid transaction has been sent.{' '}
                <a href={`https://rinkeby.etherscan.io/tx/${transactionHash}`} target='_blank'>
                  More info
                </a>
              </p>,
            ),
          );
        })
        .once('confirmation', (confNumber, receipt) => {
          this.props.dispatch(
            showNotification(
              'success',
              'Transaction confirmed',
              <p>
                Bid transaction has been confirmed.{' '}
                <a href={`https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`} target='_blank'>
                  More info
                </a>
              </p>,
            ),
          );

          this.setState({ loading: false });
          this.handleClose();
        })
        .once('error', err => {
          this.props.dispatch(
            showNotification(
              'error',
              'Transaction failed',
              <p>
                {err.message.substring(err.message.lastIndexOf(':') + 1).trim()}
                <br />
                Please try again later.
              </p>,
            ),
          );

          this.setState({ loading: false });
        });
    }

    event.preventDefault();
  };

  showDialog = () => {
    this.setState({ showDialog: true });
  };

  showAmountForm = (event: any) => {
    event.preventDefault();
    this.setState({ currentStep: 2 });
  };

  showConfirmation = (event: any) => {
    event.preventDefault();
    this.setState({ currentStep: 3 });
  };

  render() {
    const { auction, buyToken, feeRate } = this.props;
    const { amount: buyTokenAmount, currentStep = this.getInitialStep() } = this.state;

    const bidTokenBalanceInContract = utils.token.getDxBalance(buyToken);
    const bidTokenBalanceInWallet = utils.token.getWalletBalance(buyToken);
    const bidTokenBalance = bidTokenBalanceInContract.plus(bidTokenBalanceInWallet);

    const sellTokenAmount =
      auction.currentPrice && !auction.currentPrice.isZero()
        ? buyTokenAmount.div(auction.currentPrice)
        : ZERO;

    const maxSellTokenAmount = utils.auction.getAvailableVolume(auction);

    const maxBidTokenAmount = BigNumber.minimum(
      BigNumber.maximum(bidTokenBalance, ZERO),
      maxSellTokenAmount.times(auction.currentPrice || ZERO),
    );

    return (
      <Tooltip.Container>
        <Panel onClickOutside={this.handleClickOutside}>
          {this.state.showDialog && (
            <Tooltip.Dialog
              title={currentStep === 3 ? 'Your bid' : undefined}
              onBack={currentStep === 3 ? this.showAmountForm : undefined}
              theme={currentStep === 1 ? 'accent' : null}
            >
              {currentStep === 1 && (
                <Step1 onSubmit={this.showAmountForm}>
                  <p>
                    You are bidding above the previous closing price for {auction.sellToken}/
                    {auction.buyToken}
                  </p>
                  <Text>
                    <DecimalValue value={auction.closingPrice} decimals={4} postfix={auction.sellToken} />
                  </Text>
                  <Button type='submit'>Proceed</Button>
                </Step1>
              )}

              {currentStep === 2 && (
                <Step2 onSubmit={this.showConfirmation}>
                  <div>
                    <h4>Sell</h4>
                    <p>
                      {auction.buyToken} (max <DecimalValue value={maxBidTokenAmount} decimals={12} />)
                    </p>
                    <DecimalInput
                      value={buyTokenAmount.toString(10)}
                      onValueChange={this.handleAmountChange}
                      onFocus={this.handleInputFocus}
                      autoFocus={true}
                    />
                  </div>
                  <div>
                    <h4>Buy</h4>
                    <p>
                      {auction.sellToken} (max <DecimalValue value={maxSellTokenAmount} decimals={12} />)
                    </p>
                    <DecimalInput value={sellTokenAmount.toString(10)} readOnly={true} />
                  </div>
                  <Button
                    type='submit'
                    disabled={
                      !auction.currentPrice ||
                      auction.currentPrice.lte(ZERO) ||
                      buyTokenAmount.lte(ZERO) ||
                      buyTokenAmount.gt(maxBidTokenAmount)
                    }
                  >
                    Next
                  </Button>
                </Step2>
              )}

              {currentStep === 3 && (
                <Step3 onSubmit={this.handleSubmit}>
                  <div>
                    <div>
                      <h4>
                        <DecimalValue value={buyTokenAmount} decimals={2} />
                      </h4>
                      <span>{auction.buyToken}</span>
                    </div>
                    <div>
                      <h4>
                        <DecimalValue value={sellTokenAmount} decimals={2} />
                      </h4>
                      <span>
                        <small>min getting of</small> <br /> {auction.sellToken}
                      </span>
                    </div>
                  </div>
                  <p>
                    included <abbr title='Liquidity Contribution'>LC</abbr> of{' '}
                    <DecimalValue value={feeRate.times(100)} />%
                  </p>
                  <Button type='submit' disabled={this.state.loading || buyTokenAmount.lte(ZERO)}>
                    {this.state.loading ? 'Waiting confirmation...' : 'Confirm'}
                  </Button>
                </Step3>
              )}
            </Tooltip.Dialog>
          )}

          {this.state.showDialog ? (
            <CancelButton onClick={this.handleClose}>Cancel</CancelButton>
          ) : (
            <BidButton onClick={this.showDialog}>Bid</BidButton>
          )}
        </Panel>
      </Tooltip.Container>
    );
  }
}

const BidButton = styled(Button).attrs({ mode: 'secondary' })`
  margin-top: var(--spacing-normal);
`;

const CancelButton = styled(Button).attrs({ mode: 'dark' })`
  margin-top: var(--spacing-normal);
`;

const Text = styled.h4`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.25;
  letter-spacing: -0.6px;
  color: var(--color-text-primary);
  margin: var(--spacing-normal) 0;
`;

const Container = styled.form`
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
  }

  div {
    width: 100%;
  }
`;

const Step1 = styled(Container)`
  grid-gap: var(--spacing-normal);

  h4 {
    ${ellipsis('100%')};
    display: block;
    text-align: center;
    letter-spacing: -0.6px;
    color: var(--color-text-primary);
  }

  p {
    text-align: center;
  }
`;

const Step2 = styled(Container)`
  p {
    padding: 0 0 var(--spacing-text) 0;
  }
`;

const Step3 = styled(Container)`
  & > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: var(--spacing-narrow) 0;

    &:first-child:after {
      content: '▶';
      position: absolute;
      top: 45%;
      right: 47.5%;
      color: var(--color-grey);
    }

    div {
      text-align: center;

      h4 {
        font-size: 1.5rem;
        line-height: 1.25;
        letter-spacing: -0.6px;
        text-align: center;
      }
    }
  }
`;

function mapStateToProps(state: AppState, props: OwnProps): AppStateProps {
  return {
    currentAccount: getCurrentAccount(state),
    buyToken: getToken(state, props.auction.buyTokenAddress),
    feeRate: getCurrentFeeRatio(state) || ZERO,
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
)(BidForm);
