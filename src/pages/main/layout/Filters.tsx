import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Icon from '../../../components/icons';
import Overlay from '../../../components/Overlay';
import { toggleFilters } from '../../../store/ui/actions';

type SidebarProps = StateProps & DispatchProps;

interface StateProps {
  isOpen?: boolean;
}

interface DispatchProps {
  actions: {
    toggle: typeof toggleFilters;
  };
}

const Filters = React.memo(({ actions, ...props }: SidebarProps) => (
  <>
    <Content {...props}>
      <Header>
        <Title>Filters</Title>
        <CloseButton onClick={actions.toggle} />
      </Header>
    </Content>
    {props.isOpen && <Overlay onClick={actions.toggle} />}
  </>
));

const Content = styled.div`
  position: fixed;
  width: var(--sidebar-width);
  display: flex;
  flex-flow: column nowrap;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 101;
  transition: transform var(--animation-duration) ease-in-out;
  background: var(--color-main-bg);
  transform: translateX(${(props: StateProps) => (props.isOpen ? '0' : '100%')});
`;

const CloseButton = styled(Icon.Close)`
  cursor: pointer;
  margin-left: 2rem;
`;

const Header = styled.header`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding: 0 var(--spacing-normal);
  background-color: var(--color-main-bg);
  border-bottom: 1px solid var(--color-border);
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-text-primary);
`;

function mapStateToProps({ ui }: AppState): StateProps {
  return {
    isOpen: ui.filtersVisible
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    actions: {
      toggle: () => dispatch(toggleFilters())
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
