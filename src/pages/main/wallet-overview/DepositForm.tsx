import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as utils from '../../../contracts/utils';
import { getCurrentAccount, getToken } from '../../../store/blockchain';
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
  loading?: boolean;
  showDialog?: boolean;
}

const { ZERO } = utils;
const DEFAULT_DECIMALS = 3;

class DepositForm extends React.PureComponent<Props, State> {
  state: State = { amount: ZERO };

  private inputRef = React.createRef<HTMLInputElement>();

  handleAmountChange = (amount: BigNumber) => {
    this.setState({ amount });
  };

  handleClose = () => {
    if (!this.state.loading) {
      this.setState({ showDialog: false, amount: ZERO });
    }
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
    const tokenBalanceInDx = utils.token.getDxBalance(token);

    return (
      <Container onClickOutside={this.handleClose} onEscPress={this.handleClose}>
        {this.state.showDialog && (
          <Content>
            <Form onSubmit={this.handleSubmit}>
              <div>
                <h4>Volume</h4>
                <p>
                  {token.symbol} (max{' '}
                  <DecimalValue value={tokenBalanceInWallet} decimals={DEFAULT_DECIMALS} />)
                </p>
              </div>
              <DecimalInput
                value={amount.toString(10)}
                ref={this.inputRef}
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
            </Form>
          </Content>
        )}
        {this.state.showDialog ? (
          <Button mode='dark' onClick={this.handleClose}>
            Cancel
          </Button>
        ) : (
          <Button mode='secondary' onClick={this.showDialog}>
            Deposit
          </Button>
        )}
      </Container>
    );
  }
}

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
)(DepositForm);
