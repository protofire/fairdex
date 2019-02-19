import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Icon from '../../../components/icons';
import Overlay from '../../../components/Overlay';
import { hideSidebar } from '../../../store/ui/actions';
import ActionBar from './ActionBar';

type SidebarProps = OwnProps & StateProps & DispatchProps;

interface OwnProps {
  children: ReactNode;
}

interface StateProps {
  isOpen?: boolean;
}

interface DispatchProps {
  actions: {
    hideSidebar: () => void;
  };
}

const Sidebar = React.memo(({ actions, children, ...props }: SidebarProps) => (
  <Container>
    <Content {...props}>
      {children}
      <ActionBar>{props.isOpen && <CloseButton onClick={actions.hideSidebar} />}</ActionBar>
    </Content>
    {props.isOpen && <Overlay onClick={actions.hideSidebar} />}
  </Container>
));

const Container = styled.aside`
  @media (min-width: 801px) {
    ${Overlay} {
      display: none;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: var(--sidebar-width);
  height: 100vh;
  z-index: 101;
  transition: transform var(--animation-duration) ease-in-out;

  background: var(--color-main-bg);

  @media (max-width: 800px) {
    position: fixed;
    transform: translateX(${(props: StateProps) => (props.isOpen ? '0' : '-100%')});
  }

  @media (min-width: 801px) {
    position: absolute;
    transform: translateX(0);
  }

  ${ActionBar} {
    position: absolute;
    right: var(--spacing-normal);
  }
`;

const CloseButton = styled(Icon.Close)`
  cursor: pointer;

  transition: visibility 0s;
  transition-delay: var(--animation-duration);

  @media (max-width: 800px) {
    visibility: visible;
  }

  @media (min-width: 801px) {
    visibility: hidden;
  }
`;

function mapStateToProps({ ui }: AppState): StateProps {
  return {
    isOpen: ui.sidebarVisible,
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    actions: {
      hideSidebar: () => dispatch(hideSidebar()),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
