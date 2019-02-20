import React from 'react';
import styled from 'styled-components';

const SettingsIcon = () => (
  <g id='ic_wallet' transform='translate(-72 -120)'>
    <path
      id='Rectangle_136'
      d='M0 0h16v16H0z'
      className='cls-1'
      data-name='Rectangle 136'
      transform='translate(72 120)'
    />
    <path
      id='Path_74'
      d='M12 3a3.015 3.015 0 0 0-3 3v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7a1 1 0 0 1 0-2h8V3zm6 7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z'
      className='cls-2'
      data-name='Path 74'
      transform='translate(65 119)'
    />
  </g>
);

export default styled.svg.attrs(props => ({
  viewBox: '0 0 16 16',
  children: <SettingsIcon />,
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
