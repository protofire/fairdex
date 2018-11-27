import styled, { css, keyframes } from 'styled-components';

const SPINNER_SIZES = {
  big: 3.25,
  large: 3,
  medium: 2,
  mini: 0.875,
  small: 1.5,
  tiny: 1
};

interface SpinnerProps {
  inline?: boolean;
  size: keyof typeof SPINNER_SIZES;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0px;
  text-align: center;
  z-index: 1000;
  transform: translateX(-50%) translateY(-50%);

  &:before {
    position: absolute;
    content: '';
    top: 0%;
    left: 50%;
    width: 100%;
    height: 100%;

    border-radius: 100%;
    border: ${(props: SpinnerProps) => (0.2 * SPINNER_SIZES[props.size]) / SPINNER_SIZES.small}em solid
      rgba(0, 0, 0, 0.1);
  }

  &:after {
    position: absolute;
    content: '';
    top: 0%;
    left: 50%;
    width: 100%;
    height: 100%;

    animation: ${spin} 1s linear;
    animation-iteration-count: infinite;

    border: ${(props: SpinnerProps) => (0.2 * SPINNER_SIZES[props.size]) / SPINNER_SIZES.small}em solid;
    border-color: var(--color-accent-shadow) transparent transparent;
    border-radius: 100%;
    box-shadow: 0px 0px 0px 1px transparent;
  }

  // Sizes
  width: ${(props: SpinnerProps) => SPINNER_SIZES[props.size]}rem;
  height: ${(props: SpinnerProps) => SPINNER_SIZES[props.size]}rem;

  :before {
    width: ${(props: SpinnerProps) => SPINNER_SIZES[props.size]}rem;
    height: ${(props: SpinnerProps) => SPINNER_SIZES[props.size]}rem;
    margin: 0em 0em 0em ${props => -SPINNER_SIZES[props.size] / 2}rem;
  }

  :after {
    width: ${(props: SpinnerProps) => SPINNER_SIZES[props.size]}rem;
    height: ${(props: SpinnerProps) => SPINNER_SIZES[props.size]}rem;
    margin: 0em 0em 0em ${(props: SpinnerProps) => -SPINNER_SIZES[props.size] / 2}rem;
  }

  // Inline mode
  ${(props: SpinnerProps) =>
    props.inline &&
    css`
      position: relative;
      vertical-align: middle;
      margin: 0.5rem;
      left: 0em;
      top: 0em;
      transform: none;
    `}
`;

export default Spinner;
