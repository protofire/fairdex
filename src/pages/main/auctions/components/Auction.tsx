import React from 'react';
import styled from 'styled-components';

interface Props {
  data: Auction;
}

interface PropertyProps {
  name: string;
  value: string;
  className?: string;
}

const Root = styled.div`
  transition: all 2s ease;
  border-radius: 8px;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  padding: var(--spacing-normal);
`;

const Title = styled.h3`
  font-size: 2em;
  font-weight: 900;
  text-align: left;
  color: var(--color-light-grey-blue);
  margin-bottom: 1rem;
`;

const PropertyComponent = (props: PropertyProps) => {
  return (
    <div className={props.className}>
      <div className='name'>{props.name}</div>
      <div className='spacing' />
      <div className='value'>{props.value}</div>
    </div>
  );
};

const Property = styled(PropertyComponent)`
  display: flex;
  flex-flow: row nowrap;
  font-size: 0.8rem;

  .name {
    flex: 0 0 auto;
    color: var(--color-greyish);
  }
  .spacing {
    min-width: 10px;
    flex: 1 1 auto;
    border-bottom: 1px dotted var(--color-grey);
    margin: 0 2px;
  }
  .value {
    text-align: right;
    color: #303b3e;
    font-weight: bold;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  margin-top: var(--spacing-normal);
  border-radius: 24px;
  padding: 0.5rem 1rem;
  background: var(--color-main-bg);
  border: 2px solid var(--color-content-bg);
  color: var(--color-accent);
  font-weight: bold;
  font-size: 0.8rem;
  cursor: pointer;
`;

export default React.memo(function Auction(props: Props) {
  const title = `${props.data.buyToken}/${props.data.sellToken}`;
  return (
    <Root>
      <Title>{title}</Title>
      <Property name='Current price' value='asdasdasd' />
      <Property name='To end volume' value='asdasd' />
      <Property name='Started time' value='asdasd' />
      <Button>BID</Button>
    </Root>
  );
});
