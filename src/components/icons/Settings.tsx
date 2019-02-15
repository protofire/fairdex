import React from 'react';
import styled from 'styled-components';

const SettingsIcon = () => (
  <g id='ic_settings' transform='translate(-72 -120)'>
    <path
      id='Rectangle_136'
      d='M0 0h16v16H0z'
      className='cls-1'
      data-name='Rectangle 136'
      transform='translate(72 120)'
    />
    <path
      id='ic_settings-2'
      d='M15.747 7.85l-1.8-.294a5.154 5.154 0 0 0-.429-1.036l1.05-1.5a.3.3 0 0 0-.034-.39l-1.183-1.18a.3.3 0 0 0-.393-.032l-1.474 1.06a5.105 5.105 0 0 0-1.045-.434l-.314-1.792A.3.3 0 0 0 9.826 2H8.152a.3.3 0 0 0-.3.255L7.56 4.037a5.128 5.128 0 0 0-1.046.43l-1.47-1.05a.3.3 0 0 0-.392.032L3.468 4.632a.3.3 0 0 0-.034.39L4.469 6.5a5.155 5.155 0 0 0-.438 1.053l-1.775.3a.3.3 0 0 0-.254.3v1.672a.3.3 0 0 0 .251.3l1.775.315a5.13 5.13 0 0 0 .438 1.053l-1.048 1.464a.3.3 0 0 0 .032.392l1.183 1.184a.3.3 0 0 0 .39.034l1.483-1.037a5.135 5.135 0 0 0 1.049.433l.3 1.784a.3.3 0 0 0 .3.254h1.671a.3.3 0 0 0 .3-.251l.318-1.793a5.118 5.118 0 0 0 1.044-.437l1.493 1.047a.3.3 0 0 0 .39-.034l1.183-1.184a.3.3 0 0 0 .032-.393l-1.065-1.478a5.1 5.1 0 0 0 .428-1.037l1.8-.316a.3.3 0 0 0 .252-.3V8.151a.3.3 0 0 0-.254-.301zM9 11.131A2.131 2.131 0 1 1 11.133 9 2.131 2.131 0 0 1 9 11.131z'
      className='cls-2'
      data-name='ic_settings'
      transform='translate(70.998 119)'
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
