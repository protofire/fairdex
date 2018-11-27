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
  opacity: 0.75;

  touch-action: none;

  transition: opacity var(--animation-duration);
  transition-delay: var(--animation-duration);
`;

export default Overlay;
