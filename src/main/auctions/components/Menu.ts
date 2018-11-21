import styled from 'styled-components';

const Menu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  // Layout
  display: inline-grid;
  grid-auto-flow: column;
  column-gap: var(--spacing-wide);
`;

const MenuItem = styled.li`
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0;
  user-select: none;

  * {
    font-size: 110%;
    color: gray;
    border-bottom: 1px solid transparent;

    &:hover,
    &.active {
      color: black;
    }

    &.active {
      border-bottom-color: black;
    }
  }
`;

export default {
  Container: Menu,
  Item: MenuItem
};
