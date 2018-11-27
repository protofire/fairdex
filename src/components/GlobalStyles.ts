import { rem } from 'polished';
import { createGlobalStyle, css } from 'styled-components';

const variables = css`
  :root {
    // Colors
    --color-accent: rgb(219, 184, 44);
    --color-accent-shadow: rgba(219, 184, 44, 0.7);
    --color-border: rgba(0, 0, 0, 0.05);
    --color-content-bg: #f4f6f8;
    --color-main-bg: #ffffff;
    --color-text-primary: #131f3e; // FIXME
    --color-text-secondary: #adadad; // FIXME
    --color-light-grey-blue: #85c3d6; // FIXME
    --color-greyish: #adadad;
    --color-grey: #d9dee2;
    --color-pale-grey: #f4f6f8;

    // Layout
    --card-height: ${rem('256px')};
    --card-width: ${rem('256px')};
    --header-height: ${rem('72px')};
    --sidebar-width: ${rem('320px')};
    --spacing-normal: ${rem('32px')};

    // Spacing
    --spacing-narrow: ${rem('32px')};
    --spacing-normal: ${rem('32px')};
    --spacing-wide: ${rem('32px')};
  }
`;

const GlobalStyles = createGlobalStyle`
  ${variables}

  html {
    box-sizing: border-box;
    overflow-y: scroll;
  }

  body {
    font-family: 'Open Sans', sans-serif;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  a {
    text-decoration: none;
  }

  h1, h2, h3 {
    margin: 0;
  }

  #root {
    background-color: var(--color-content-bg);
  }
`;

export default GlobalStyles;
