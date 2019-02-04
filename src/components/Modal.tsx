import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import Box from './Box';
import Overlay from './Overlay';
import Panel from './Panel';

interface Props {
  isOpen: boolean;
  onClickOutside?: (() => void) | null;
  onEscPress?: (() => void) | null;
}

const Modal: FunctionComponent<Props> = ({ isOpen, onClickOutside, onEscPress, children }) => {
  return (
    <>
      <Root isOpen={isOpen}>
        <AuctionPanel onClickOutside={onClickOutside} onEscPress={onEscPress}>
          <Content>{children}</Content>
        </AuctionPanel>
      </Root>
      {isOpen && <ModalOverlay onClick={onClickOutside} />}
    </>
  );
};

const Root = styled.div`
  position: fixed;
  z-index: 1000;
  top: 10rem;
  left: calc(var(--sidebar-width) + calc(calc(100% - var(--sidebar-width)) / 2));
  width: calc(calc(100% - var(--sidebar-width)) * 0.8);
  max-width: var(--input-modal-width);
  transition-property: transform;
  transition-duration: var(--animation-duration);

  ${({ isOpen }: Pick<Props, 'isOpen'>) => {
    if (isOpen) {
      return css`
        opacity: 0;
        animation: fadeModalIn;
        animation-duration: var(--animation-duration);
        animation-fill-mode: forwards;
        animation-delay: var(--animation-duration);

        @keyframes fadeModalIn {
          from {
            opacity: 0.1;
          }
          to {
            opacity: 1;
          }
        }
        transform: translateY(0) translateX(-50%);
      `;
    } else {
      return css`
        opacity: 1;
        animation: fadeOut;
        animation-duration: var(--animation-duration);
        animation-fill-mode: forwards;

        @keyframes fadeOut {
          from {
            opacity: 0.9;
          }
          to {
            opacity: 0;
          }
        }

        transition-delay: var(--animation-duration);
        transform: translateY(-200%) translateX(-50%);
      `;
    }
  }};

  @media (max-width: 800px) {
    left: 50%;
    width: 80%;
  }
`;

const ModalOverlay = styled(Overlay)`
  opacity: 0;
  animation-delay: var(--animation-duration);
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
