import React from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import styled from 'styled-components';

import Button from '../../../../components/Button';
import { Numeric } from '../../../../components/formatters';
import Tooltip from '../../../../components/Tooltip';

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
      <Tooltip.Container>
        {showDialog &&
          (showWarning && +auction.currentPrice < +auction.closingPrice ? (
            <Tooltip.Dialog theme='accent'>
              <p>
                You are bidding above the previous closing price for {auction.sellToken}/{auction.buyToken}
              </p>

              <Text>
                <Numeric value={auction.closingPrice} decimals={4} postfix={auction.sellToken} />
              </Text>

              <Button onClick={this.hideWarning}>Proceed</Button>
            </Tooltip.Dialog>
          ) : (
            <Tooltip.Dialog>
              <Button onClick={this.hideDialog}>Confirm</Button>
            </Tooltip.Dialog>
          ))}

        {showDialog ? (
          <CancelButton onClick={this.hideDialog}>Cancel</CancelButton>
        ) : (
          <BidButton onClick={this.showDialog}>Bid</BidButton>
        )}
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
  line-height: 1.25;
  letter-spacing: -0.6px;
  color: var(--color-text-primary);
  margin: var(--spacing-wide) 0;
`;

export default enhanceWithClickOutside(BidForm);
