import React from 'react';
import styled from 'styled-components';

const PreferencesIcon = () => (
  <g transform='translate(-504 -24)'>
    <path d='M0 0h24v24H0z' className='shape-1' transform='translate(504 24)' />
    <path d='M0 0h16v2H0z' className='shape-2' transform='translate(508 29)' />
    <path d='M0 0h16v2H0z' className='shape-2' transform='translate(508 41)' />
    <path d='M0 0h16v2H0z' className='shape-2' transform='translate(508 35)' />
    <g className='shape-3' transform='translate(510 27)'>
      <circle cx={3} cy={3} r={3} className='shape-4' />
      <circle cx={3} cy={3} r={2} className='shape-1' />
    </g>
    <g className='shape-3' transform='translate(516 33)'>
      <circle cx={3} cy={3} r={3} className='shape-4' />
      <circle cx={3} cy={3} r={2} className='shape-1' />
    </g>
    <g className='shape-3' transform='translate(510 39)'>
      <circle cx={3} cy={3} r={3} className='shape-4' />
      <circle cx={3} cy={3} r={2} className='shape-1' />
    </g>
  </g>
);

export default styled.svg.attrs(props => ({
  viewBox: '0 0 24 24',
  children: <PreferencesIcon />,
}))`
  width: 24px;
  height: 24px;

  .shape-1 {
    fill: none;
  }

  .shape-2 {
    fill: #131f3e;
  }

  .shape-3 {
    fill: #f4f6f8;
    stroke: #131f3e;
    stroke-width: 2px;
  }

  .shape-4 {
    stroke: none;
  }
`;
