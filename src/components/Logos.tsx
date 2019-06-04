import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

import * as images from '../images';

const Logos = (props: HTMLAttributes<HTMLDivElement>) => (
  <Wrapper {...props}>
    <Row>
      <Proto>
        <a href={'https://protofire.io'} target='_blank' rel='noopener noreferrer'>
          Built by <img src={images.protofire} />
        </a>
      </Proto>
    </Row>
    <Row>
      <Geco>
        <img src={images.geco} />
      </Geco>
      <Dutchx>
        <img src={images.dutchx} />
      </Dutchx>
    </Row>
  </Wrapper>
);

const Wrapper = styled.footer`
  color: #303b3e;
  display: flex;
  flex-direction: column;
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

const Row = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
`;

const Geco = styled(Dutchx)``;
const Proto = styled(Dutchx)`
  margin-bottom: 10px;

  img {
    vertical-align: middle;
  }
`;

export default Logos;
