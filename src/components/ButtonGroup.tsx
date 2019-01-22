import styled from 'styled-components';

import Popup from './Popup';

const ButtonGroup = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: var(--spacing-narrow);

  & > * {
    width: 100%;

    &:nth-child(n + 2) {
      margin-left: var(--spacing-narrow);
    }
  }

  & ${Popup.Container}:not(:only-child) {
    position: unset;

    &:nth-child(-n + 1) {
      ${Popup.Content} {
        left: 0;

        &:after {
          left: calc(25% - var(--box-arrow-height) / 2);
        }
      }
    }

    &:nth-child(n + 2) {
      ${Popup.Content} {
        right: 0;

        &:after {
          left: calc(75% - var(--box-arrow-height) / 2);
        }
      }
    }
  }
`;

export default ButtonGroup;
