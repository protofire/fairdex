import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Icon from '../../../components/icons';

const NavBar = () => (
  <Menu>
    <Item to='/auction'>
      <Icon.Auctions />
      Auctions
    </Item>
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

  &:hover,
  &.active {
    background-color: var(--color-content-bg);
  }

  svg {
    margin: 0 19px;
  }
`;

export default withRouter(NavBar);
