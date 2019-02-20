import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

import ResponsiveEmbed from 'react-responsive-embed';

const Step1 = () => {
  const handlePause = useCallback(event => {
    event.target.pauseVideo();
  }, []);

  const handlePlay = useCallback(event => {
    event.target.playVideo();
  }, []);

  return (
    <>
      <ResponsiveEmbed src='https://www.youtube.com/embed/_TBVXT6XIe0' />
      <p>
        The <b>DutchX</b> is a fully decentralized trading protocol that allows anyone to add any trading
        token pair.
      </p>
      <p>
        It uses the Dutch auction principle to prevent the problems that other exchanges are experiencing
        (such as front running, issues with low liquidity, and third party risk),{' '}
        <b>creating a more fair ecosystem</b> for everyone to use.
      </p>
    </>
  );
};

const PlayerWrapper = styled.div`
  width: 100%;
  height: 56.25%;

  div {
    height: 100%;
  }

  iframe {
    width: 100%;
    height: 100%;
  }
`;

export default Step1;
