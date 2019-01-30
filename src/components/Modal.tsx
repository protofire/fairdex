import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import Box from './Box';
import Overley from './Overlay';
import Panel from './Panel';

interface Props {
  isOpen: boolean;
  onClickOutside?: (() => void) | null;
  onEscPress?: (() => void) | null;
  parentTop: number;
  parentLeft: number;
}

const Modal: FunctionComponent<Props> = ({
  isOpen,
  parentTop,
  parentLeft,
  onClickOutside,
  onEscPress,
  children,
}) => {
  return (
    <>
      <Root isOpen={isOpen} parentLeft={parentLeft} parentTop={parentTop}>
        <AuctionPanel onClickOutside={onClickOutside} onEscPress={onEscPress}>
          <Content>{children}</Content>
        </AuctionPanel>
      </Root>
      {isOpen && <Overley onClick={onClickOutside} />}
    </>
  );
};

const Root = styled.div`
  position: fixed;
  z-index: 1000;
  top: 10rem;
  left: calc(var(--sidebar-width) + calc(calc(100% - var(--sidebar-width)) / 2));
  width: calc(calc(100% - var(--sidebar-width)) * 0.8);
  transition-property: opacity, transform;
  transition-duration: var(--animation-duration);
  opacity: ${(props: Props) => (props.isOpen ? 1 : 0)};
  transform: ${(props: Props) => (props.isOpen ? 'translateY(0)' : 'translateY(-200%)')} translateX(-50%);

  @media (max-width: 800px) {
    left: 50%;
    width: 80%;
  }
`;

const AuctionPanel = styled(Panel)`
  height: 100%;
  width: 100%;
`;

export const Content = styled(Box)`
  width: 100%;
  height: 100%;
  padding: var(--spacing-normal);

  &:after {
    display: none;
    content: '';
  }
`;

export default Modal;
