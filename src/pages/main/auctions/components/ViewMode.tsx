import { rem } from 'polished';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const ViewModeSelector = styled.aside`
  display: none;

  @media (min-width: 801px) {
    display: inline-grid;
    grid-template-columns: repeat(3, auto);
    column-gap: var(--spacing-narrow);
  }
`;

export const ViewModeButton = styled(NavLink)`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: ${rem('40px')};
  height: ${rem('40px')};
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  font-weight: 300;

  &:active {
    background: transparent;
    border-color: var(--color-accent);
    font-weight: 400;
  }

  &:focus {
    outline: none;
  }

  &:hover:not(:active) {
    background: var(--color-accent);
    color: white;
  }
`;

export default {
  Button: ViewModeButton,
  Selector: ViewModeSelector
};
