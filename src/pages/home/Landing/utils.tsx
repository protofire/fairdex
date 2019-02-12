import styled from 'styled-components';
import Separator from '../../../components/Separator';

export const StepTitle = styled.div`
  display: flex;
  border-bottom: 2px solid var(--color-content-bg);

  &:first-child {
    h3 {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.33;
      color: #000000;
      margin-bottom: var(--spacing-text);
    }

    ${Separator} {
      width: 100%;
      margin: 0 0 -3px 0;
    }
  }
`;

export const Content = styled.div`
  flex: 1;
  margin-top: var(--spacing-wide);

  p {
    font-size: 1em !important;
    line-height: 1.38 !important;
  }

  ol {
    color: #adadad;
  }

  a {
    color: #dbb82c;

    &:link,
    &:visited {
      color: #dbb82c;
    }
  }
`;
