import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import * as images from '../images';

const Logos = (props: HTMLAttributes<HTMLDivElement>) => (
  <Wrapper {...props}>
    <Dutchx>
      <img src={images.dutchx} />
    </Dutchx>
    <Protofire>
      <span> by </span>
      <img src={images.logo} />
    </Protofire>
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

const Protofire = styled.div`
  align-items: center;
  display: flex;

  img {
    width: 144px;
    height: 40px;
    margin: 0 10px;
  }

  @media (max-width: 767px) {
    span {
      display: none;
    }
  }
`;

const Dutchx = styled.div`
  display: flex;
  align-items: center;

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

export default Logos;
