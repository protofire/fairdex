import React from 'react';
import styled from 'styled-components';

const BackIcon = () => (
  <g transform='translate(-504 -24)'>
    <path d='M0 0h24v24H0z' transform='translate(504 24)' fill='none' />
    <path
      d='M15564.417 11662.363h-2.831l8.242-8.242 1.415 1.416-6.825 6.826z'
      className='shape'
      transform='translate(-15053.585 -11626.363)'
    />
    <path
      d='M15565.826 11663.24l-8.24-8.241h2.828l6.828 6.831-1.414 1.41z'
      className='shape'
      transform='translate(-15049.585 -11619)'
    />
    <path d='M0 0h14v2H0z' className='shape' transform='translate(510 35)' />
  </g>
);

export default styled.svg.attrs({
  viewBox: '0 0 24 24',
  children: BackIcon,
})`
  width: 24px;
  height: 24px;

  .shape {
    fill: #131f3e;
  }
`;
