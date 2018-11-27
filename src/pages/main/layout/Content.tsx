import styled from 'styled-components';

const Content = styled.main`
  height: 100%;
  min-height: 100vh;

  transition: margin var(--animation-duration) ease-in-out;

  @media (max-width: 800px) {
    margin-left: 0;
  }

  @media (min-width: 801px) {
    margin-left: var(--sidebar-width);
  }
`;

export default Content;
