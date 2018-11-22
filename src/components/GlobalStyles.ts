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
    --color-text-primary: #131f3e;
    --color-text-secondary: #adadad;

    // Layout
    --card-height: ${rem('256px')};
    --card-width: ${rem('256px')};
    --header-height: ${rem('72px')};
    --sidebar-width: ${rem('320px')};
    --spacing-normal: ${rem('32px')};

    // Breakpoints TODO: move to constants
    phone-max-width: 800px;
    tablet-min-width: 801px;

    @media (min-width: 1025px) {
      --card-width: ${rem('280px')};
    }
  }
`;

const GlobalStyles = createGlobalStyle`
  ${variables}

  html {
    box-sizing: border-box;
    overflow-y: scroll;
  }

  body {
    font-family: 'Lato', Georgia, sans-serif;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  a {
    text-decoration: none;
  }
`;

export default GlobalStyles;
