import React from 'react';
import styled from 'styled-components';

const AuctionIcon = () => (
  <g id='ic_auctions' transform='translate(-48 -120)'>
    <path
      id='Rectangle_135'
      d='M0 0h16v16H0z'
      className='cls-1'
      data-name='Rectangle 135'
      transform='translate(48 120)'
    />
    <path
      id='ic_auctions-2'
      d='M3.393 2L1 2.008l.007 1.4L2.46 3.4l2.307 5.536-.838 1.34A1.477 1.477 0 0 0 5.161 12.5H13.6v-1.4H5.161c-.078 0-.087-.015-.045-.082L5.939 9.7h5.229a1.4 1.4 0 0 0 1.224-.721l2.522-4.542A.7.7 0 0 0 14.3 3.4H3.977zM5.2 13.2a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4zm7 0a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4z'
      className='cls-2'
      data-name='ic_auctions'
      transform='translate(47.996 119.004)'
    />
  </g>
);

export default styled.svg.attrs(props => ({
  viewBox: '0 0 16 16',
  children: <AuctionIcon />,
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
