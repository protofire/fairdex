import styled from 'styled-components';

interface ActionBarProps {
  side?: 'left' | 'right';
}

const ActionBar = styled.div`
  height: var(--header-height);
  padding: 0;

  display: flex;
  align-items: center;
  float: ${(props: ActionBarProps) => props.side};
`;

export default ActionBar;
