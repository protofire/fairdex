import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import * as images from '../images';

const Logos = (props: HTMLAttributes<HTMLDivElement>) => (
  <Wrapper {...props}>
    <Geco>
      <img src={images.geco} />
    </Geco>
    <Dutchx>
      <img src={images.dutchx} />
    </Dutchx>
  </Wrapper>
);

const Wrapper = styled.footer`
  color: #303b3e;
  display: flex;
  flex-flow: row;
  font-size: 9px;
  font-weight: 600;
  justify-content: center;
  padding: 0 0 40px;
`;

const Dutchx = styled.div`
  display: flex;
  align-items: center;
  user-select: none;

  img {
    height: 40px;
    margin: 0 10px;
  }

  @media (max-width: 767px) {
    span {
      display: none;
    }
  }
`;

const Geco = styled(Dutchx)``;

export default Logos;
