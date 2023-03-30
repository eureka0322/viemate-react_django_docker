import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { hideNotification } from 'redux/modules/notifications';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {} from './Messages.scss';

@connect(state => ({
  messages: state.notification_messages.notifications
}), {
  hideNotification
})
export default class NotifiactionMessages extends Component {
  static propTypes = {
    messages: PropTypes.object,
    hideNotification: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.hideNotification = ::this.hideNotification;
    this.handleKeyDown = ::this.handleKeyDown;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    const { messages } = this.props;

    if (e.keyCode === 27 && Object.keys(messages).length) {
      Object.keys(messages).map(c => this.hideNotification(c));
    }
  }

  hideNotification(name) {
    this.props.hideNotification(name);
  }

  render() {
    const { messages } = this.props;
    return (
      <ReactCSSTransitionGroup
        component="div"
        transitionName="notifications"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {Object.keys(messages).length &&
          <div className="notifications">
            <div className="notifications__wrap">
              {Object.keys(messages).map(c =>
                <div className={'alert alert-dismissible' + (messages[c].type === 'success' ? ' alert--success' : messages[c].type === 'error' ? ' alert--danger' : ' alert--info')} key={c}>
                  <span className="alert__icon">
                    <i className="icon icon--success-md" />
                    <i className="icon icon--error-lg" />
                  </span>
                  <span className="alert__text">{messages[c].text || 'Your information was successfly updated'}</span>
                  {messages[c].show_btn_hide &&
                    <button className="alert__hide-notif form-button form-button--clear form-button--hide-notif" onClick={() => this.hideNotification(c)}>
                      <i className="icon icon--close" />
                    </button>
                  }
                </div>
              )}
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    );
  }
}
