import React from 'react';
import styled from 'styled-components';

import Box from './Box';
import Panel from './Panel';

export const Content = styled(Box)`
  width: 100%;

  p {
    margin: var(--spacing-text) 0 0;
    font-size: 0.8rem;
    letter-spacing: -0.3px;
    text-align: center;
    color: var(--color-text-secondary);
  }
`;

export const Container = styled(Panel)`
  position: relative;

  ${Content} {
    position: absolute;
    bottom: calc(100% + var(--box-arrow-height) * 1.1);
  }
`;

const Header = styled.header`
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(var(--spacing-title) * 2);
  border-bottom: 1px solid var(--color-border);
  user-select: none;

  h4 {
    line-height: var(--header-height);
    text-align: center;
    text-transform: uppercase;
    flex: 1;
  }
`;

export default {
  Content,
  Container,
  Header,
};
