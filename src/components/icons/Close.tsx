import React from 'react';
import styled from 'styled-components';

const CloseIcon = () => (
  <g transform='translate(-552 -24)'>
    <path d='M0 0h24v24H0z' transform='translate(552 24)' fill='none' />
    <g transform='translate(48.079 .7)'>
      <path
        d='M0 0l15.856.144.018 1.982L.018 1.982z'
        className='shape'
        transform='rotate(45 220.506 631.362)'
      />
      <path
        d='M0 0l15.856-.144-.018 1.982-15.856.144z'
        className='shape'
        transform='rotate(-45 303.481 -595.028)'
      />
    </g>
  </g>
);

export default styled.svg.attrs({
  viewBox: '0 0 24 24',
  children: CloseIcon,
})`
  width: 24px;
  height: 24px;

  .shape {
    fill: #131f3e;
  }
`;
