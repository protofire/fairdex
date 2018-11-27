import styled from 'styled-components';

const Button = styled.button`
  height: 40px;
  padding: 0 calc(var(--spacing-normal) * 0.5);
  background-color: #f77902;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;

  &:focus {
    outline: 0;
  }

  &:hover {
    box-shadow: 0 8px 24px 0 rgba(247, 121, 2, 0.5);
  }
`;

export default Button;
