import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Message from '../../../components/Message';
import { hideNotification } from '../../../store/ui/actions';

type Props = StateProps & DispatchProps;

interface StateProps {
  infoMessage?: InfoMessage;
}

interface DispatchProps {
  actions: {
    dismiss: typeof hideNotification;
  };
}

class MessageHandler extends React.PureComponent<Props> {
  onClose = () => {
    this.props.actions.dismiss();
  };

  render() {
    const { infoMessage } = this.props;
    return (
      <Message
        visible={!!infoMessage}
        type={infoMessage && infoMessage.type}
        title={infoMessage && infoMessage.title}
        onClose={this.onClose}
      >
        {infoMessage && infoMessage.content}
      </Message>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    infoMessage: state.ui.infoMessage,
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    actions: {
      dismiss: () => dispatch(hideNotification()),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageHandler);
