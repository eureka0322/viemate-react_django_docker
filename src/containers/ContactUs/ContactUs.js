import React, {Component, PropTypes} from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { sendMessage } from 'redux/modules/contactUs';
import validate from './validate';
import {ContactUs as Contact} from 'components';
import { showAuth } from 'redux/modules/modals';

@connect(st => ({
  sending: st.contactUs.sending,
  user: st.auth.user,
}), {
  sendMessage,
  authPopup: showAuth
})
@reduxForm({
  form: 'contact-us',
  touchOnBlur: false,
  validate
})
export default class ContactUs extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    sendMessage: PropTypes.func,
    authPopup: PropTypes.func,
    user: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      sended_success: false,
    };
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    this.props.sendMessage(data).then(() => {
      this.setState({sended_success: true});
      this.props.reset();
    }, (err) => {
      if (err.body.errors && err.body.errors.full_messages) {
        const errors_keys = Object.keys(err.body.errors);
        let errors = {};
        errors_keys.forEach(c => {
          errors = { ...errors, [c]: err.body.errors[c][0], [`sign_up_${c}`]: err.body.errors[c][0] };
        });
        throw new SubmissionError({ ...errors, _error: err.body.errors.full_messages[0] });
      } else {
        throw new SubmissionError({ _error: (err.body.error || err.body.errors[0] || '') });
      }
    });
  }

  render() {
    const {handleSubmit, user, authPopup, ...rest} = this.props;

    return (
      <div>
        <Contact.Banner />
        <div className="container container--sm-extra-width">
          <Contact.Info user={user} showAuth={() => authPopup()} />
          {user && !this.state.sended_success && <Contact.Form {...rest} handleSubmit={handleSubmit(this.handleSubmit)} />}
          {user && this.state.sended_success && <Contact.Success />}
        </div>
      </div>
    );
  }
}
