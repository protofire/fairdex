import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { isAfter } from 'date-fns';

import { DecimalValue, Duration, Timestamp } from '../../../components/formatters';
import { ZERO } from '../../../contracts/utils';
import {
  getAvailableVolume,
  getClosingPriceRate,
  getCurrentPriceRate,
  getEstimatedEndTime,
} from '../../../contracts/utils/auctions';

import ButtonGroup from '../../../components/ButtonGroup';
import Modal from '../../../components/Modal';
import { getAuctionDetail } from '../../../store/blockchain';
import BidForm from './BidForm';
import ClaimForm from './claim/ClaimForm';

interface StateProps {
  auction?: Auction | null;
}

interface OwnProps extends HTMLAttributes<HTMLDivElement> {
  onClickOutside?: (() => void) | null;
  onEscPress?: (() => void) | null;
  isOpen: boolean;
}

type Props = StateProps & OwnProps;

const DEFAULT_DECIMALS = 3;

const AuctionDetail = ({ auction, onClickOutside, onEscPress, isOpen }: Props) => {
  return (
    <Modal onClickOutside={onClickOutside} onEscPress={onEscPress} isOpen={isOpen}>
      {auction && <Content auction={auction} />}
    </Modal>
  );
};

interface ContentProp {
  auction: Auction;
}

const Content = ({ auction }: ContentProp) => (
  <>
    <Title title={`Bid with ${auction.buyToken} to buy ${auction.sellToken}`}>
      <div>
        <small>bid with</small>
        <h3>{auction.buyToken}</h3>
      </div>
      <Separator>▶</Separator>
      <div>
        <small>to buy</small>
        <h3>{auction.sellToken}</h3>
      </div>
    </Title>

    {auction.state === 'running' && (
      <>
        <Table>
          <Row>
            <Label>Current price</Label>
            <Value>
              {auction.currentPrice === undefined ? (
                <Loading />
              ) : (
                <span title={getCurrentPriceRate(auction)}>
                  <DecimalValue value={auction.currentPrice} decimals={DEFAULT_DECIMALS} hideTitle={true} />
                  <small>
                    {' '}
                    {auction.buyToken}/{auction.sellToken}
                  </small>
                </span>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Previous closing price</Label>
            <Value>
              {auction.closingPrice === undefined ? (
                <Loading />
              ) : (
                <span title={getClosingPriceRate(auction)}>
                  <DecimalValue value={auction.closingPrice} decimals={DEFAULT_DECIMALS} hideTitle={true} />
                  <small>
                    {' '}
                    {auction.buyToken}/{auction.sellToken}
                  </small>
                </span>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Sell volume</Label>
            <Value>
              {auction.sellVolume === undefined || auction.buyVolume === undefined ? (
                <Loading />
              ) : (
                <>
                  <DecimalValue
                    value={auction.sellVolume.times(auction.currentPrice)}
                    decimals={DEFAULT_DECIMALS}
                  />
                  <small> {auction.buyToken}</small>
                </>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Volume needed to end</Label>
            <Value>
              {auction.sellVolume === undefined || auction.buyVolume === undefined ? (
                <Loading />
              ) : (
                <>
                  <DecimalValue
                    value={getAvailableVolume(auction).times(auction.currentPrice)}
                    decimals={DEFAULT_DECIMALS}
                  />
                  <small> {auction.buyToken}</small>
                </>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Start time</Label>
            <Value>{auction.auctionStart ? <Timestamp value={auction.auctionStart} /> : <Loading />}</Value>
          </Row>
          <Row helpText='Any auction reaches the last auction price of the previous auction after 6h'>
            <Label>Estimated time to end</Label>
            <Value>
              {auction.auctionStart === undefined ? (
                <Loading />
              ) : isAfter(getEstimatedEndTime(auction), Date.now()) ? (
                <Duration to={getEstimatedEndTime(auction)} prefix={'in'} />
              ) : (
                <Duration from={getEstimatedEndTime(auction)} postfix={'ago'} />
              )}
            </Value>
          </Row>
        </Table>

        <ButtonGroup>
          <BidForm auction={auction} />
          {auction.unclaimedFunds && auction.unclaimedFunds.isGreaterThan(ZERO) && (
            <ClaimForm auction={auction} />
          )}
        </ButtonGroup>
      </>
    )}

    {auction.state === 'scheduled' && (
      <>
        <Table>
          <Row>
            <Label>{auction.auctionIndex === '0' ? 'Initial' : 'Previous'} closing price</Label>
            <Value>
              {auction.closingPrice === undefined ? (
                <Loading />
              ) : (
                <span title={getClosingPriceRate(auction)}>
                  <DecimalValue value={auction.closingPrice} decimals={DEFAULT_DECIMALS} hideTitle={true} />
                  <small>
                    {' '}
                    {auction.buyToken}/{auction.sellToken}
                  </small>
                </span>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Sell volume</Label>
            <Value>
              {auction.sellVolume === undefined ? (
                <Loading />
              ) : (
                <>
                  <DecimalValue value={auction.sellVolume} decimals={DEFAULT_DECIMALS} />
                  <small> {auction.sellToken}</small>
                </>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Estimated time to start</Label>
            <Value>
              {auction.auctionStart === undefined ? <Loading /> : <Duration to={auction.auctionStart} />}
            </Value>
          </Row>
        </Table>
      </>
    )}

    {auction.state === 'ended' && (
      <>
        <Table>
          <Row>
            <Label>{auction.auctionIndex === '0' ? 'Initial' : 'Closing'} price</Label>
            <Value>
              {auction.closingPrice === undefined ? (
                <Loading />
              ) : (
                <span title={getClosingPriceRate(auction)}>
                  <DecimalValue value={auction.closingPrice} decimals={DEFAULT_DECIMALS} hideTitle={true} />
                  <small>
                    {' '}
                    {auction.buyToken}/{auction.sellToken}
                  </small>
                </span>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Sell volume</Label>
            <Value>
              {auction.sellVolume === undefined ? (
                <Loading />
              ) : (
                <>
                  <DecimalValue value={auction.sellVolume} decimals={DEFAULT_DECIMALS} />
                  <small> {auction.sellToken}</small>
                </>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Buy volume</Label>
            <Value>
              {auction.buyVolume === undefined ? (
                <Loading />
              ) : (
                <>
                  <DecimalValue value={auction.buyVolume} decimals={DEFAULT_DECIMALS} />
                  <small> {auction.buyToken}</small>
                </>
              )}
            </Value>
          </Row>
          <Row>
            <Label>Start time</Label>
            <Value>{auction.auctionStart ? <Timestamp value={auction.auctionStart} /> : <Loading />}</Value>
          </Row>
          <Row>
            <Label>End time</Label>
            <Value>
              {auction.auctionEnd === undefined ? <Loading /> : <Timestamp value={auction.auctionEnd} />}
            </Value>
          </Row>
        </Table>

        <ButtonGroup>
          {auction.unclaimedFunds && auction.unclaimedFunds.isGreaterThan(ZERO) && (
            <ClaimForm auction={auction} />
          )}
        </ButtonGroup>
      </>
    )}
  </>
);

const Label = styled.dt`
  position: relative;
  flex: 1;
  overflow: hidden;
  color: var(--color-greyish);

  &:after {
    position: absolute;
    content: '${'.'.repeat(400)}';
    color: var(--color-grey);
    margin-left: var(--spacing-text);
  }
`;

const Loading = styled.span.attrs(props => ({
  children: '…',
  title: 'Calculating value',
}))`
  color: var(--color-greyish);
  user-select: none;
  cursor: progress;

  &:hover {
    color: inherit;
  }
`;

const Value = styled.dd`
  margin-left: var(--spacing-text);
  font-weight: 600;
  color: var(--color-text-primary);
`;

interface RowProps {
  helpText?: string;
}

const Row = styled.div.attrs((props: RowProps) => ({
  title: props.helpText || '',
}))`
  display: flex;
  overflow: hidden;

  ${Label}, ${Value} {
    line-height: 1.5rem;
  }

  ${Label} {
    cursor: ${(props: any) => (props.helpText ? 'help' : null)};
  }
`;

const Table = styled.dl`
  display: grid;
  font-size: 0.875rem;
  letter-spacing: -0.4px;
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;

  & > div {
    display: inline-flex;
    flex-direction: column;
  }

  h3 {
    font-size: 2em;
    font-weight: 900;
    color: var(--color-light-grey-blue);
  }

  small {
    font-size: 80%;
    text-transform: lowercase;
    color: var(--color-grey);
  }
`;

const Separator = styled.div`
  font-size: 80%;
  color: var(--color-grey);
  margin: 0 var(--spacing-text);
  padding-top: var(--spacing-title);
  user-select: none;
`;

function mapStateToProps(state: AppState): StateProps {
  return {
    auction: getAuctionDetail(state),
  };
}

export default connect(mapStateToProps)(AuctionDetail);
