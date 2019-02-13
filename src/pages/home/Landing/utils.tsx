import styled from 'styled-components';
import Separator from '../../../components/Separator';

export const StepTitle = styled.div`
  border-bottom: 2px solid var(--color-content-bg);
  display: flex;
  padding-top: 10px;

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
    font-size: 16px !important;
    line-height: 1.4 !important;
    padding: 0 12px;
  }

  ol {
    color: #adadad;

    li {
      line-height: 1.7;
    }
  }

  a {
    color: #dbb82c;

    &:link,
    &:visited {
      color: #dbb82c;
    }
  }
`;
