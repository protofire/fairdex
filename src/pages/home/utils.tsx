import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  min-height: 100vh;

  h2 {
    text-transform: uppercase;
  }

  h3 {
    font-size: 32px;
    font-weight: 800;
    text-align: center;
    color: var(--color-light-grey-blue);
  }

  p {
    margin: 0;
    font-size: 14px;
    font-weight: normal;

    color: var(--color-greyish);
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const Footer = styled.footer`
  margin: var(--spacing-wide) 0;
  user-select: none;

  img {
    width: 60px;
    height: 60px;
    vertical-align: middle;
  }

  span {
    margin-left: 10px;
    color: var(--color-greyish);
  }
`;
