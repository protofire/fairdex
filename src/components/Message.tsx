import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import Icon from './icons';

interface Props {
  visible: boolean;
  type?: InfoMessageType;
  title?: string;
  onClose: () => void;
}

const Message: FunctionComponent<Props> = props => (
  <Root {...props}>
    {props.children && (
      <>
        <CloseButton onClick={props.onClose} />
        {props.title && <Title>{props.title}</Title>}
        <Content>{props.children}</Content>
      </>
    )}
  </Root>
);

const Root = styled.section`
  position: fixed;
  z-index: 100;
  top: 2rem;
  left: 50%;
  width: 384px;
  margin-left: -192px;
  padding: var(--spacing-normal);
  color: #fff;
  transition-property: opacity, transform;
  transition-duration: var(--animation-duration);
  opacity: ${(props: Props) => (props.visible ? 0.8 : 0)};
  transform: ${(props: Props) => (props.visible ? 'translateY(0)' : 'translateY(-150%)')};
  border-radius: 8px;

  ${(props: Props) => {
    if (props.type === 'error') {
      return css`
        box-shadow: 0 8px 24px 0 rgba(255, 51, 28, 0.5);
        background-color: #ff331c;
      `;
    } else if (props.type === 'success') {
      return css`
        box-shadow: 0 8px 24px 0 rgba(133, 195, 214, 0.5);
        background-color: var(--color-light-grey-blue);
      `;
    } else {
      return css`
        box-shadow: 0 8px 24px 0 rgba(28, 157, 255, 0.5);
        background-color: #1c9dff;
      `;
    }
  }}
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const CloseButton = styled(Icon.Close)`
  position: absolute;
  top: var(--spacing-normal);
  right: var(--spacing-normal);
  cursor: pointer;
`;

const Content = styled.div`
  font-size: 0.8rem;
  letter-spacing: -0.4px;
  text-align: center;
`;

export default React.memo(Message);
