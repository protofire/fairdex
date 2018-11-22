import styled from 'styled-components';

import Card from './Card';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
  grid-gap: var(--spacing-normal);

  ${Card} {
    height: var(--card-height);
    transition: all 2s ease;
  }
`;

export default Grid;
