import React from 'react';
import styled from 'styled-components';

const HelpIcon = () => (
  <g id='ic_settings' transform='translate(-96 -120)'>
    <path
      id='Rectangle_137'
      d='M0 0h16v16H0z'
      className='cls-1'
      data-name='Rectangle 137'
      transform='translate(96 120)'
    />
    <path
      id='ic_help'
      d='M9 2a7 7 0 1 0 7 7 7 7 0 0 0-7-7zm.7 11.9H8.3v-1.4h1.4zm1.449-5.425l-.63.644A2.383 2.383 0 0 0 9.7 11.1H8.3v-.35a2.818 2.818 0 0 1 .819-1.981l.868-.882A1.369 1.369 0 0 0 10.4 6.9a1.4 1.4 0 1 0-2.8 0H6.2a2.8 2.8 0 1 1 5.6 0 2.227 2.227 0 0 1-.651 1.575z'
      className='cls-2'
      transform='translate(95 119)'
    />
  </g>
);

export default styled.svg.attrs(props => ({
  viewBox: '0 0 16 16',
  children: <HelpIcon />,
}))`
  width: 16px;
  height: 16px;

  .cls-1 {
    fill: none;
  }
  .cls-2 {
    fill: #dbb82c;
  }
`;
