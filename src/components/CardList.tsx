import styled from 'styled-components';

import Card from './Card';

export const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
  grid-gap: var(--spacing-normal);

  ${Card} {
    display: flex;
    flex-direction: column;
    height: 100%;

    & > *:last-child {
      flex: 1;
    }
  }
`;

export const EmptyList = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - var(--header-height) - var(--spacing-normal) * 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  user-select: none;

  img {
    width: 48px;
    height: 48px;
  }

  h3 {
    padding: var(--spacing-text) 0;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 2.14;
    letter-spacing: -0.4px;
    text-align: center;
    color: var(--color-grey);
  }
`;
