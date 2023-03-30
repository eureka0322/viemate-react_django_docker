import React, { Component, PropTypes } from 'react';
import {} from './NewMessage.scss';
import { Form, Avatar } from 'elements';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import validate from './validate';
import { connect } from 'react-redux';
import { showDefault } from 'redux/modules/notifications';

const NewMessageTextarea = field =>
  <Form.Textarea
    field={field}
    {...field}
  />;


@connect((st) => ({
  user: st.auth.user,
}), {
  showDefault,
})
@reduxForm({
  form: 'form-send-email',
  validate,
})
export default class NewMessage extends Component {
  static propTypes = {
    sendMessage: PropTypes.func,
    closeModal: PropTypes.func,
    showDefault: PropTypes.func,
    message_for: PropTypes.string,
    ownerAvatar: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.submit = ::this.submit;
  }

  componentWillMount() {
    const { user } = this.props;
    if (user && user.profile && !user.profile.avatar) {
      this.props.showDefault('message_no_avatar');
      this.props.closeModal();
    }
  }

  submit(data) {
    return this.props.sendMessage(data.message).catch((err) => {
      if (err.body.errors && err.body.errors.full_messages) {
        const errors_keys = Object.keys(err.body.errors);
        let errors = {};
        errors_keys.forEach(c => {
          errors = { ...errors, [c]: err.body.errors[c][0] };
        });
        throw new SubmissionError({ ...errors, _error: err.body.errors.full_messages[0] });
      } else {
        throw new SubmissionError({ _error: (err.body.error || err.body.errors[0] || '') });
      }
    });
  }

  render() {
    const { disabled, ownerAvatar, error } = this.props;

    return (
      <div className="message-container message-container--popup">
        <div className="message-container__wrapper">
          <h1 className="message-container__title">Send message to <span>{this.props.message_for}</span></h1>
          <form className="message-container__form" onSubmit={this.props.handleSubmit(this.submit)}>
            <span className="avatar-wrapper avatar-wrapper--md-max avatar-wrapper--position-left"><Avatar img={ownerAvatar} /></span>
            <div className="message-container__textarea message-container__textarea--new-message">
              <Field
                name="message"
                component={NewMessageTextarea}
                placeholder="Ask about the place, neighborhood and the city!"
                rows="12"
              />
            </div>
            {error &&
              <div className="message-container__form-item">
                <Form.Error message={error} />
              </div>
            }
            <div className="message-container__separator" />
            <div className="info-box__nav table">
              <div className="info-box__panel-info table__cell">
                <i className="icon icon--worry" />
                <span className="info-text">Do not wire money, send your ID or share your private information. Please report any user who asks for it.</span>
              </div>
              <div className="info-box__nav-btn table__cell">
                <button
                  className={'form-button form-button--pink form-button--circle form-button--user-action form-button--loader' + (disabled ? ' form-button--loading' : '')}
                  type="submit"
                  disabled={disabled}
                >
                  <span>Send</span>
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    );
  }

}
