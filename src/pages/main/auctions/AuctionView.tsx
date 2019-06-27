import React, { HTMLAttributes, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { ZERO } from '../../../contracts/utils';
import {
  getAvailableVolume,
  getClosingPriceRate,
  getCurrentPriceRate,
  getEstimatedEndTime,
} from '../../../contracts/utils/auctions';

import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';
import Card from '../../../components/Card';
import { DecimalValue, Timestamp, TimeTo } from '../../../components/formatters';
import InfoIcon from '../../../components/InfoIcon';
import { updateAuction } from '../../../store/blockchain/auctions';
import { showAuctionDetail } from '../../../store/ui/actions';

import BidForm from './bid/BidForm';
import ClaimForm from './claim/ClaimForm';

interface AuctionViewProps extends HTMLAttributes<HTMLDivElement> {
  data: Auction;
  onCardClick?: (auction: Auction) => void;
}

interface DispatchProps {
  dispatch: any;
}

type Props = AuctionViewProps & DispatchProps;

const DEFAULT_DECIMALS = 3;

const AuctionView = React.memo(({ data: auction, onCardClick, dispatch, ...props }: Props) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const root = useRef(null);
  const title = useRef(null);
  const table = useRef(null);
  const buttonGroup = useRef(null);

  const handleCardClick = useCallback((event: MouseEvent) => {
    if (event && root && title && title.current && table && table.current) {
      if (
        event.target === root.current ||
        event.target === title.current ||
        title.current.contains(event.target) ||
        table.current.contains(event.target)
      ) {
        if (onCardClick && typeof onCardClick === 'function') {
          const detail: AuctionDetail = {
            buyToken: auction.buyToken,
            sellToken: auction.sellToken,
            auctionIndex: auction.auctionIndex,
          };
          dispatch(showAuctionDetail(detail));
          onCardClick(auction);
        }
      }
    }
  }, []);

  const handleActive = useCallback(
    (event: MouseEvent) => {
      if (event && buttonGroup && buttonGroup.current) {
        if (event.type === 'mousedown' && !buttonGroup.current.contains(event.target)) {
          setIsMouseDown(true);
        } else {
          setIsMouseDown(false);
        }
      }
    },
    [isMouseDown],
  );

  // Reload auction data
  useEffect(
    () => {
      let subscription: NodeJS.Timeout;

      if (auction && auction.state === 'running') {
        const interval = getRandomInt(5_000, 9_000); // Random interval between 5-9 seconds

        subscription = setInterval(() => {
          dispatch(updateAuction(auction));
        }, interval);
      }

      return () => {
        if (subscription) {
          clearInterval(subscription);
        }
      };
    },
    [auction.state],
  );

  return (
    <AuctionCard
      ref={root}
      data-testid={`auction-card-${auction.sellToken}-${auction.buyToken}-${auction.auctionIndex}`}
      onClick={handleCardClick}
      onMouseDown={handleActive}
      onMouseUp={handleActive}
      active={isMouseDown}
      {...props}
    >
      <Title title={`Bid with ${auction.buyToken} to buy ${auction.sellToken}`} ref={title}>
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
          <Table ref={table}>
            <Row>
              <Label>Current price</Label>
              <Value>
                {auction.currentPrice === undefined ? (
                  <Loading />
                ) : (
                  <span title={getCurrentPriceRate(auction)}>
                    <DecimalValue
                      value={auction.currentPrice.value}
                      decimals={DEFAULT_DECIMALS}
                      hideTitle={true}
                    />
                    <small>
                      {' '}
                      {auction.buyToken}
                      &ensp;
                      <InfoIcon />
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
                    <DecimalValue
                      value={auction.closingPrice.value}
                      decimals={DEFAULT_DECIMALS}
                      hideTitle={true}
                    />
                    <small>
                      {' '}
                      {auction.buyToken}
                      &ensp;
                      <InfoIcon />
                    </small>
                  </span>
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
                    <DecimalValue value={getAvailableVolume(auction)} decimals={DEFAULT_DECIMALS} />
                    <small> {auction.buyToken}</small>
                  </>
                )}
              </Value>
            </Row>
            <Row helpText='Any auction reaches the last auction price of the previous auction after 6h'>
              <Label>Estimated time to end</Label>
              <Value>
                {auction.auctionStart === undefined ? (
                  <Loading />
                ) : (
                  <TimeTo to={getEstimatedEndTime(auction)} />
                )}
              </Value>
            </Row>
          </Table>

          <ButtonGroup ref={buttonGroup}>
            <BidForm auction={auction} />
            {auction.unclaimedFunds && auction.unclaimedFunds.isGreaterThan(ZERO) && (
              <ClaimForm auction={auction} />
            )}
          </ButtonGroup>
        </>
      )}

      {auction.state === 'scheduled' && (
        <>
          <Table ref={table}>
            <Row>
              <Label>{auction.auctionIndex === '0' ? 'Initial' : 'Previous'} closing price</Label>
              <Value>
                {auction.closingPrice === undefined ? (
                  <Loading />
                ) : (
                  <span title={getClosingPriceRate(auction)}>
                    <DecimalValue
                      value={auction.closingPrice.value}
                      decimals={DEFAULT_DECIMALS}
                      hideTitle={true}
                    />
                    <small>
                      {' '}
                      {auction.buyToken}
                      &ensp;
                      <InfoIcon />
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
                {auction.auctionStart === undefined ? <Loading /> : <TimeTo to={auction.auctionStart} />}
              </Value>
            </Row>
          </Table>
        </>
      )}

      {auction.state === 'ended' && (
        <>
          <Table ref={table}>
            <Row>
              <Label>{auction.auctionIndex === '0' ? 'Initial' : 'Closing'} price</Label>
              <Value>
                {auction.closingPrice === undefined ? (
                  <Loading />
                ) : (
                  <span title={getClosingPriceRate(auction)}>
                    <DecimalValue
                      value={auction.closingPrice.value}
                      decimals={DEFAULT_DECIMALS}
                      hideTitle={true}
                    />
                    <small>
                      {' '}
                      {auction.buyToken}
                      &ensp;
                      <InfoIcon />
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
              <Label>End time</Label>
              <Value>
                {auction.auctionEnd === undefined ? <Loading /> : <Timestamp value={auction.auctionEnd} />}
              </Value>
            </Row>
          </Table>

          <ButtonGroup ref={buttonGroup}>
            {auction.unclaimedFunds && auction.unclaimedFunds.isGreaterThan(ZERO) && (
              <ClaimForm auction={auction} />
            )}
          </ButtonGroup>
        </>
      )}
    </AuctionCard>
  );
});

const AuctionCard = styled(Card)`
  cursor: pointer;

  &:hover {
    background-color: #fefeff;
  }

  ${(props: any) => {
    if (props.active) {
      return css`
        &:active {
          background-color: #fcfdff;
          box-shadow: inset 0px 0px 20px 2px rgba(0, 0, 0, 0.05);

          ${Button} {
            background-color: #fcfdff;
          }
        }
      `;
    }
  }}
`;

const Label = styled.dt`
  position: relative;
  flex: 1;
  overflow: hidden;
  color: var(--color-greyish);

  &:after {
    position: absolute;
    content: '${'.'.repeat(200)}';
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

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    dispatch,
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(AuctionView);
