import React from 'react';
import styled from 'styled-components';

import { DecimalValue, Duration } from '../../../components/formatters';
import { getEstimatedEndTime } from '../../../contracts/utils/auction';
import BidForm from './BidForm';

interface Props {
  data: Auction;
}

const DEFAULT_DECIMALS = 3;

const AuctionView = React.memo(({ data: auction }: Props) => (
  <Card>
    <Title title={`Bid with ${auction.buyToken} to buy ${auction.sellToken}`}>
      <span>{auction.buyToken}</span>
      <Separator>▶</Separator>
      <span>{auction.sellToken}</span>
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
                <DecimalValue value={auction.currentPrice} decimals={DEFAULT_DECIMALS} />
              )}
              <small>
                {' '}
                {auction.buyToken}/{auction.sellToken}
              </small>
            </Value>
          </Row>
          <Row>
            <Label>Previous closing price</Label>
            <Value>
              {auction.closingPrice === undefined ? (
                <Loading />
              ) : (
                <DecimalValue value={auction.closingPrice} decimals={DEFAULT_DECIMALS} />
              )}
              <small>
                {' '}
                {auction.buyToken}/{auction.sellToken}
              </small>
            </Value>
          </Row>
          <Row>
            <Label>Volume needed to end</Label>
            <Value>
              {auction.sellVolume === undefined || auction.buyVolume === undefined ? (
                <Loading />
              ) : (
                <DecimalValue
                  value={auction.sellVolume.minus(auction.buyVolume)}
                  decimals={DEFAULT_DECIMALS}
                />
              )}
              <small> {auction.sellToken}</small>
            </Value>
          </Row>
          <Row>
            <Label>Estimated time to end</Label>
            <Value>
              {auction.auctionStart === undefined ? (
                <Loading />
              ) : (
                <Duration to={getEstimatedEndTime(auction)} />
              )}
            </Value>
          </Row>
        </Table>
        <BidForm auction={auction} />
      </>
    )}
  </Card>
));

const Card = styled.div`
  padding: var(--spacing-normal);
  border-radius: 8px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.05);
  background-color: var(--color-main-bg);
  transition: all 2s ease;
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

const Loading = styled.span.attrs({
  children: '…',
  title: 'Calculating value',
})`
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

const Row = styled.div`
  display: flex;
  overflow: hidden;

  ${Label}, ${Value} {
    line-height: 1.5rem;
  }
`;

const Table = styled.dl`
  display: grid;
  font-size: 0.875rem;
  letter-spacing: -0.4px;
`;

const Title = styled.h3`
  display: inline-flex;
  align-items: center;
  font-size: 2em;
  font-weight: 900;
  color: var(--color-light-grey-blue);
`;

const Separator = styled.span`
  font-size: 40%;
  color: var(--color-grey);
  margin: 0 var(--spacing-text);
`;

export default AuctionView;
