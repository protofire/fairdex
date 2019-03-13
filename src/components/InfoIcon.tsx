import styled from 'styled-components';

const InfoIcon = styled.span.attrs({
  children: 'ⓘ',
})`
  font-size: 110%;
  font-weight: bold;
  color: var(--color-text-orange);
  cursor: help;
`;

export default InfoIcon;
