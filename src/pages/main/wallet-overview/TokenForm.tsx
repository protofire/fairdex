import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Tooltip from '../../../components/Tooltip';

import DecimalInput from '../../../components/DecimalInput';
import { DecimalValue } from '../../../components/formatters';
import Panel from '../../../components/Panel';
import * as utils from '../../../contracts/utils';
import { getCurrentAccount, getToken } from '../../../store/blockchain';
import { showNotification } from '../../../store/ui/actions';

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
  loading?: boolean;
  showDialog?: boolean;
}

const { ZERO } = utils;
const DEFAULT_DECIMALS = 3;

class TokenForm extends React.PureComponent<Props, State> {
  state: State = { amount: ZERO };

  handleAmountChange = (amount: BigNumber) => {
    this.setState({ amount });
  };

  handleClose = () => {
    if (!this.state.loading) {
      this.setState({ showDialog: false, amount: ZERO });
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

    // TODO handle deposit

    event.preventDefault();
  };

  showDialog = () => {
    this.setState({ showDialog: true });
  };

  render() {
    const { token } = this.props;
    const { amount } = this.state;

    const tokenBalanceInWallet = utils.token.getWalletBalance(token);

    return (
      <Tooltip.Container>
        <Panel onClickOutside={this.handleClickOutside}>
          {this.state.showDialog && (
            <Dialog>
              <Container onSubmit={this.handleSubmit}>
                <div>
                  <h4>Volume</h4>
                  <p>
                    {token.symbol} (max{' '}
                    <DecimalValue value={tokenBalanceInWallet} decimals={DEFAULT_DECIMALS} />)
                  </p>
                </div>
                <DecimalInput
                  value={amount.toString(10)}
                  onValueChange={this.handleAmountChange}
                  onFocus={this.handleInputFocus}
                  autoFocus={true}
                />
                <Button
                  type='submit'
                  disabled={
                    tokenBalanceInWallet.lte(ZERO) || amount.lte(ZERO) || amount.gt(tokenBalanceInWallet)
                  }
                >
                  Confirm
                </Button>
              </Container>
            </Dialog>
          )}
          <Actions>
            {this.state.showDialog ? (
              <CancelButton onClick={this.handleClose}>Cancel</CancelButton>
            ) : (
              <DepositButton onClick={this.showDialog}>Deposit</DepositButton>
            )}

            <WithdrawButton onClick={this.showDialog}>Withdraw</WithdrawButton>
          </Actions>
        </Panel>
      </Tooltip.Container>
    );
  }
}

const DepositButton = styled(Button).attrs({ mode: 'secondary' })``;
const WithdrawButton = styled(Button).attrs({ mode: 'secondary' })``;

const CancelButton = styled(Button).attrs({ mode: 'dark' })``;

const Dialog = styled(Tooltip.Dialog)`
  &:after {
    left: 25%;
  }
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

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  margin-top: var(--spacing-normal);
`;

function mapStateToProps(state: AppState, props: OwnProps): AppStateProps {
  return {
    currentAccount: getCurrentAccount(state),
    token: props.token,
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
)(TokenForm);
