import React from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;
`;

const Landing = () => (
  <Container>
    <Redirect to='/auctions' />
  </Container>
);

export default Landing;
