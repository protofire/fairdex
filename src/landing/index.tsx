import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;
`;

const Panel = styled.div`
  width: 80%;
  height: 80%;
  max-width: 600px;
  max-height: 500px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px solid lightgray;
  border-radius: 0.3rem;
`;

const Landing = () => (
  <Container>
    <Panel>
      <Link to='/auctions'>Accept Terms & Conditions</Link>
    </Panel>
  </Container>
);

export default Landing;
