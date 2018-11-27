import React from 'react';
import styled from 'styled-components';

const MenuIcon = () => (
  <g transform='translate(-600 -24)'>
    <path d='M0 0h24v24H0z' transform='translate(600 24)' fill='none' />
    <g transform='translate(-556)'>
      <path d='M0 0h16v2H0z' className='shape' transform='translate(1160 29)' />
      <path d='M0 0h16v2H0z' className='shape' transform='translate(1160 41)' />
      <path d='M0 0h16v2H0z' className='shape' transform='translate(1160 35)' />
    </g>
  </g>
);

export default styled.svg.attrs({
  viewBox: '0 0 24 24',
  children: MenuIcon
})`
  width: 24px;
  height: 24px;

  .shape {
    fill: #131f3e;
  }
`;
