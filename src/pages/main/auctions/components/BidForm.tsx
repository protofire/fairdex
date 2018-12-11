import React from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import styled from 'styled-components';

import Button from '../../../../components/Button';
import { Numeric } from '../../../../components/formatters';

interface Props {
  auction: Auction;
  onBid: () => void;
}

interface State {
  showDialog?: boolean;
  showWarning?: boolean;
}

class BidForm extends React.PureComponent<Props, State> {
  state = {
    showDialog: false,
    showWarning: true,
  };

  handleClickOutside = () => {
    this.hideDialog();
  };

  toggleDialog = () => {
    this.state.showDialog ? this.hideDialog() : this.showDialog();
  };

  showDialog = () => {
    this.setState({ showDialog: true, showWarning: true });
  };

  hideDialog = () => {
    this.setState({ showDialog: false, showWarning: false });
  };

  hideWarning = () => {
    this.setState({ showWarning: false });
  };

  render() {
    const { auction } = this.props;
    const { showDialog, showWarning } = this.state;

    return (
      <Container>
        {showDialog &&
          (showWarning && +auction.currentPrice < +auction.closingPrice ? (
            <Tooltip accent>
              <p>
                You are bidding above the previous closing price for {auction.sellToken}/{auction.buyToken}
              </p>

              <Text>
                <Numeric value={auction.closingPrice} decimals={4} postfix={auction.sellToken} />
              </Text>

              <Button onClick={this.hideWarning}>Proceed</Button>
            </Tooltip>
          ) : (
            <Tooltip>
              <Button onClick={this.toggleDialog}>Confirm</Button>
            </Tooltip>
          ))}

        {showDialog ? (
          <CancelButton onClick={this.toggleDialog}>Cancel</CancelButton>
        ) : (
          <BidButton onClick={this.toggleDialog}>Bid</BidButton>
        )}
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
`;

const BidButton = styled(Button).attrs({ mode: 'secondary' })`
  margin-top: var(--spacing-normal);
`;

const CancelButton = styled(Button).attrs({ mode: 'dark' })`
  margin-top: var(--spacing-normal);
`;

const Tooltip = styled.div`
  position: absolute;
  width: 100%;
  bottom: calc(100% + 15px);
  padding: var(--spacing-normal);
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: center;
  background-color: ${(props: { accent?: boolean }) => (props.accent ? '#fff0e2' : 'var(--color-main-bg)')};
  border-radius: 8px;
  box-shadow: 0 20px 40px 0 rgba(48, 59, 62, 0.3);

  p {
    margin: 0 0 var(--spacing-normal);
    padding: 0 var(--spacing-narrow);
    line-height: 1.14;
    letter-spacing: -0.4px;
  }

  &:after {
    position: absolute;
    display: block;
    content: '';
    width: 0;
    bottom: -7.5px;
    left: 45%;
    border-style: solid;
    border-width: 7.5px 10px 0;
    border-color: ${(props: any) => (props.accent ? '#fff0e2' : 'var(--color-main-bg)')} transparent;
  }
`;

const Text = styled.h4`
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.25;
  letter-spacing: -0.6px;
  color: var(--color-text-primary);
  margin: var(--spacing-wide) 0;
`;

export default enhanceWithClickOutside(BidForm);
