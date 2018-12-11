import styled, { css } from 'styled-components';

interface DialogProps {
  theme?: 'normal' | 'accent';
}

const Dialog = styled.div`
  position: absolute;
  padding: var(--spacing-normal);
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: center;
  background-color: var(--color-main-bg);
  border-radius: 8px;
  box-shadow: 0 20px 40px 0 rgba(48, 59, 62, 0.3);

  p {
    margin: 0 0 var(--spacing-normal);
    padding: 0 var(--spacing-narrow);
    line-height: 1.14;
    letter-spacing: -0.4px;
  }

  &:after {
    position: absolute;
    display: block;
    content: '';
    width: 0;
    bottom: -7.5px;
    left: 45%;
    border-style: solid;
    border-width: 7.5px 10px 0;
    border-color: var(--color-main-bg) transparent;
  }

  ${({ theme }: DialogProps) => {
    switch (theme) {
      case 'accent':
        return css`
          background-color: #fff0e2;

          &:after {
            border-color: #fff0e2 transparent;
          }
        `;

      default:
        return null;
    }
  }};
`;

const Container = styled.div`
  position: relative;

  ${Dialog} {
    position: absolute;
    bottom: calc(100% + 15px);
    width: 100%;
  }
`;

export default { Container, Dialog };
