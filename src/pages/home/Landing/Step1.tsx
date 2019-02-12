import React, { useCallback } from 'react';
import styled from 'styled-components';

import YouTube from 'react-youtube';

const Step1 = () => {
  const onReady = useCallback(event => {
    event.target.pauseVideo();
  }, []);

  return (
    <div>
      <YouTube
        videoId='_TBVXT6XIe0'
        opts={{
          width: '570',
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
          },
        }}
        onReady={onReady}
      />
      <p>
        The <b>DutchX</b> is a fully decentralized trading protocol that allows anyone to add any trading
        token pair.
      </p>
      <p>
        It uses the Dutch auction principle to prevent the problems that other exchanges are experiencing
        (such as front running, issues with low liquidity, and third party risk),{' '}
        <b>creating a more fair ecosystem</b> for everyone to use.
      </p>
    </div>
  );
};
export default Step1;
