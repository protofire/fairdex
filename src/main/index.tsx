import React from 'react';
import Loadable from 'react-loadable';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Layout = styled.div`
  display: grid;
  width: 100%;
  min-height: 100vh;

  @media (min-width: 600px) {
    grid-template-columns: 12rem 1fr;
  }

  @media (min-width: 801px) {
    grid-template-columns: 15rem 1fr;
  }

  @media (min-width: 1025px) {
    grid-template-columns: 20rem 1fr;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  background: #fafaf7;
`;

const Branding = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--header-height);
  text-align: center;
  border-bottom: 1px solid lightgray;
  user-select: none;
`;

const AuctionList = Loadable({
  loader: () => import('./auctions'),
  loading: () => <h4>Loading auction list...</h4>
});

const Wallet = Loadable({
  loader: () => import('./wallet'),
  loading: () => <h4>Loading wallet...</h4>
});

const MainPage = () => (
  <Layout>
    <Sidebar>
      <Branding>
        <Link to='/'>
          <img src='https://protofire.io/img/protofire.svg' />
        </Link>
      </Branding>
      <Wallet />
    </Sidebar>
    <Content>
      <AuctionList />
    </Content>
  </Layout>
);

export default MainPage;
