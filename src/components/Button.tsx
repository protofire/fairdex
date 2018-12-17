import styled, { css } from 'styled-components';

interface ButtonProps {
  inline?: boolean;
  mode?: 'primary' | 'secondary' | 'dark';
}

const Button = styled.button`
  display: block;
  height: var(--button-height);
  width: ${(props: ButtonProps) => (props.inline ? 'auto' : '100%')};
  padding: 0 calc(var(--spacing-normal) * 0.5);
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;

  &:disabled {
    opacity: 0.25;
    pointer-events: none;
    user-focus: none;
    user-select: none;
  }

  &:focus {
    outline: 0;
  }

  ${(props: ButtonProps) => {
    switch (props.mode) {
      case 'secondary':
        return css`
          color: var(--color-text-orange);
          background-color: var(--color-main-bg);
          border: 2px solid var(--color-content-bg);

          &:hover {
            box-shadow: 0 0 12px 0 rgba(217, 222, 226, 0.25);
          }
        `;

      case 'dark':
        return css`
          color: var(--color-main-bg);
          background-color: var(--color-text-primary);

          &:hover {
            box-shadow: 0 0 12px 0 rgba(217, 222, 226, 0.25);
          }
        `;

      default:
        return css`
          color: var(--color-main-bg);
          background-color: var(--color-text-orange);

          &:hover {
            box-shadow: 0 8px 24px 0 rgba(247, 121, 2, 0.5);
          }
        `;
    }
  }};
`;

export default Button;
