import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: var(--color-content-bg);

  touch-action: none;

  animation: overlayFadeIn;
  animation-duration: var(--animation-duration);
  animation-fill-mode: forwards;

  @keyframes overlayFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.75;
    }
  }
`;

export default Overlay;
