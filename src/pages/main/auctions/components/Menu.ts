import styled from 'styled-components';

export const Menu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  // Layout
  display: inline-grid;
  grid-auto-flow: column;
  column-gap: var(--spacing-normal);
`;

export const MenuItem = styled.li`
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0;
  user-select: none;

  a {
    font-size: 15px;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    &:hover,
    &.active {
      color: var(--color-text-primary);
    }

    &.active {
      position: relative;

      &::after {
        position: absolute;
        content: '';
        height: 3px;
        left: 0;
        right: 0;
        bottom: -2.5px;
        background: var(--color-accent);
        border-radius: 10px;
        box-shadow: 0 1px 8px 0 var(--color-accent-shadow);
      }
    }
  }
`;
