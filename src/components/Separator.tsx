import styled from 'styled-components';

const Separator = styled.div`
  width: 64px;
  height: 3px;
  margin: var(--spacing-normal) 0;

  background: var(--color-accent);
  border-radius: 10px;
  box-shadow: 0 1px 8px 0 var(--color-accent-shadow);
`;

export default Separator;
