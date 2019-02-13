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
  display: flex;
  align-items: center;
  width: 256px;
  height: 48px;
  border-radius: 8px;

  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 2.14;
  letter-spacing: -0.4px;

  &:hover,
  &.active {
    background-color: var(--color-content-bg);
  }

  svg {
    margin: 0 19px;
  }
`;

export default withRouter(NavBar);
