import { rem } from 'polished';
import { createGlobalStyle, css } from 'styled-components';

const variables = css`
  :root {
    // Color palette
    --color-accent: #f77901;

    // Layout
    --header-height: ${rem('50px')};

    // Spacing
    --spacing-narrow: ${rem('8px')};
    --spacing-normal: ${rem('16px')};
    --spacing-wide: ${rem('32px')};

    @media (min-width: 320px) {
    }

    @media (min-width: 480px) {
    }

    @media (min-width: 600px) {
      --header-height: ${rem('80px')};
    }

    @media (min-width: 801px) {
      --spacing-narrow: ${rem('16px')};
      --spacing-normal: ${rem('32px')};
      --spacing-wide: ${rem('48px')};

      --header-height: ${rem('100px')};
    }

    @media (min-width: 1025px) {
    }

    @media (min-width: 1281px) {
    }
  }
`;

const GlobalStyles = createGlobalStyle`
  ${variables}

  body {
    font-family: 'Lato', sans-serif;
  }

  a {
    text-decoration: none;
  }
`;

export default GlobalStyles;
