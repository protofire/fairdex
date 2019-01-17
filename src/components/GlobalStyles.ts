import { rem } from 'polished';
import { createGlobalStyle, css } from 'styled-components';

const variables = css`
  :root {
    // Colors
    --color-accent: #dbb82c;
    --color-accent-shadow: rgba(219, 184, 44, 0.7);
    --color-border: rgba(0, 0, 0, 0.05);
    --color-content-bg: #f4f6f8;
    --color-main-bg: #ffffff;
    --color-text-primary: #131f3e;
    --color-text-secondary: #adadad;
    --color-text-orange: #f77902;
    --color-text-inverse: #ffffff;
    --color-light-grey-blue: #85c3d6;
    --color-greyish: #adadad;
    --color-grey: #d9dee2;

    // Layout
    --button-height: ${rem('40px')};
    --box-arrow-height: ${rem('10px')};
    --card-height: ${rem('256px')};
    --card-width: ${rem('280px')};
    --header-height: ${rem('72px')};
    --input-height: ${rem('40px')};
    --sidebar-width: ${rem('320px')};

    // Spacing
    --spacing-title: 0.75rem;
    --spacing-text: 0.5rem;
    --spacing-narrow: 1rem;
    --spacing-normal: 2rem;
    --spacing-wide: 3rem;

    // Animations
    --animation-duration: 250ms;
  }
`;

const GlobalStyles = createGlobalStyle`
  ${variables}
  
  #root {
    min-width: 100vw;
    min-height: 100vh;
    background-color: var(--color-content-bg);
  }

  html {
    box-sizing: border-box;
    overflow-y: scroll;
    font-size: 16px;
  }

  body {
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  a {
    text-decoration: none;
    
    &, &:link, &:visited {
      color: var(--color-text-primary);  
    }
  }

  h1, h2, h3 {
    margin: 0;
    font-size: 1rem;
  }
  
  label {
    line-height: 1.75;
    letter-spacing: -0.4px;
    color: var(--color-text-primary);
  }
`;

export default GlobalStyles;
