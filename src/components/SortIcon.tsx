import styled, { css } from 'styled-components';

import sortDownImage from '../images/sorting_arrow_down.svg';
import sortUpImage from '../images/sorting_arrow_up.svg';
import sortNoneImage from '../images/sorting_inactive.svg';

interface SortIconProps {
  dir: SortDir;
}

const SortIcon = styled.span`
  width: 14px;
  height: 14px;
  display: inline-block;
  margin-right: var(--spacing-text);
  object-fit: contain;
  cursor: pointer;

  ${({ dir }: SortIconProps) => {
    let src = sortNoneImage;
    if (dir === 'asc') {
      src = sortUpImage;
    } else if (dir === 'desc') {
      src = sortDownImage;
    }
    return `background-image: url(${src})`;
  }}
`;

export default SortIcon;
