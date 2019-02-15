import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Icon from '../../../components/icons';
import * as images from '../../../images';

const NavBar = () => (
  <Menu>
    <Item to='/auction'>
      <Icon.Auctions />
      Auctions
    </Item>
    <Item to='/wallet'>
      <Icon.Wallet />
      Wallet
    </Item>
    <Item exact to='/'>
      <Icon.Help />
      Help
    </Item>
    <Link href='https://t.me/dutchXprotocol' target='_blank' rel='noopener noreferrer'>
      <ImageIcon src={images.telegram} />
      Feedback/Questions
    </Link>
  </Menu>
);

const Menu = styled.nav`
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Item = styled(NavLink)`
  align-items: center;
  border-radius: 8px;
  display: flex;
  font-stretch: normal;
  font-style: normal;
  font-weight: 600;
  height: 48px;
  letter-spacing: -0.4px;
  line-height: 2.14;
  transition: all 0.15s ease-out;
  width: 256px;
  margin: var(--spacing-text);

  &:hover,
  &.active {
    background-color: var(--color-content-bg);
  }

  svg,
  img {
    margin: 0 19px;
  }
`;

const Link = styled.a`
  align-items: center;
  border-radius: 8px;
  display: flex;
  font-stretch: normal;
  font-style: normal;
  font-weight: 600;
  height: 48px;
  letter-spacing: -0.4px;
  line-height: 2.14;
  transition: all 0.15s ease-out;
  width: 256px;
  margin: var(--spacing-text);

  &:hover,
  &.active {
    background-color: var(--color-content-bg);
  }

  svg,
  img {
    margin: 0 19px;
  }
`;

const ImageIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export default withRouter(NavBar);
