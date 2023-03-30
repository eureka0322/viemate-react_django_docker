import React, { Component, PropTypes } from 'react';
import {} from './AuthModal.scss';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { register, logIn, resetPass, facebook_auth, google_auth } from 'redux/modules/auth';
import SignUp from './SignUp.js';
import ResetPass from './ResetPass.js';
import SignIn from './SignIn.js'; // eslint-disable-line
import { showNotification } from 'redux/modules/notifications';
import {replace} from 'react-router-redux';
import {clearSpaces} from 'utils/helpers';
import { showEmail } from 'redux/modules/modals';

@connect((st) => ({
  authCallback: st.modals.authCallback,
  hidden_email_modal: st.modals.hidden_email,
  loading: st.auth.loggingIn,
  user: st.auth.user
}), {
  register,
  logIn,
  resetPass,
  showNotification,
  facebook_auth,
  google_auth,
  replace,
  showEmail
})

export default class AuthModal extends Component {
  static propTypes = {
    register: PropTypes.func,
    logIn: PropTypes.func,
    closeModal: PropTypes.func,
    resetPass: PropTypes.func,
    showNotification: PropTypes.func,
    facebook_auth: PropTypes.func,
    google_auth: PropTypes.func,
    authCallback: PropTypes.func,
    replace: PropTypes.func,
    showEmail: PropTypes.func,
    callbackUrl: PropTypes.string,
    not_modal: PropTypes.bool,
    hidden_email_modal: PropTypes.bool,
    user: PropTypes.object

    // redux-form
    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    // errors: PropTypes.object,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    // pristine: PropTypes.bool.isRequired,
    // submitting: PropTypes.bool.isRequired,
    // handleSubmit: PropTypes.func.isRequired,Form
    // reset: PropTypes.func.isRequired,
    // error: PropTypes.string,
    // valid: PropTypes.bool.isRequired
  };

  static defaultProps = {
    not_modal: false,
    callbackUrl: '/',
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAuth: 'SIGN_IN'
    };
    this.handleSingIn = ::this.handleSingIn;
    this.handleSingUp = ::this.handleSingUp;
    this.handleResetPassword = ::this.handleResetPassword;
    this.facebookAuth = ::this.facebookAuth;
    this.googleAuth = ::this.googleAuth;
    this.changeAuthModal = ::this.changeAuthModal;
    this.authSuccess = ::this.authSuccess;
    this.resetSuccess = ::this.resetSuccess;
  }

  changeAuthModal(activeAuth = 'SIGN_IN') {
    this.setState({ activeAuth });
  }

  handleSingUp(data) {
    data = {...data, first_name: clearSpaces(data.first_name), last_name: clearSpaces(data.last_name), email: data.sign_up_email, password: data.sign_up_password};
    if (data.sign_up_email) delete data.sign_up_email;
    if (data.sign_up_password) delete data.sign_up_password;
    return this.props.register(data).then((r) => {
      if (r.errors && r.errors.full_messages) {
        const errors_keys = Object.keys(r.errors);
        let errors = {};
        errors_keys.forEach(c => {
          errors = { ...errors, [c]: r.errors[c][0], [`sign_up_${c}`]: r.errors[c][0] };
        });
        throw new SubmissionError({ ...errors, _error: r.errors.full_messages[0] });
      } else {
        this.authSuccess();
      }
    }, (err) => {
      if (err.body.errors && err.body.errors.full_messages) {
        const errors_keys = Object.keys(err.body.errors);
        let errors = {};
        errors_keys.forEach(c => {
          errors = { ...errors, [c]: err.body.errors[c][0], [`sign_up_${c}`]: err.body.errors[c][0], };
        });
        console.log(errors);
        this.props.showNotification('auth_error', {type: 'error', text: err.body.errors.full_messages[0]});
        throw new SubmissionError({ ...errors, _error: err.body.errors.full_messages[0] });
      } else {
        this.props.showNotification('auth_error', {type: 'error', text: err.body.error || err.body.errors[0] || 'Authorization error'});
        throw new SubmissionError({ _error: (err.body.error || err.body.errors[0] || '') });
      }
    });
  }

  handleSingIn(data) {
    return this.props.logIn(data).then((r) => {
      if (r.errors && r.errors.full_messages) {
        const errors_keys = Object.keys(r.errors);
        let errors = {};
        errors_keys.forEach(c => {
          errors = { ...errors, [c]: r.errors[c][0] };
        });
        throw new SubmissionError({ ...errors, _error: r.errors.full_messages[0] });
      } else {
        this.authSuccess();
      }
    }, (err) => {
      if (err.body.errors && err.body.errors.full_messages) {
        const errors_keys = Object.keys(err.body.errors);
        let errors = {};
        errors_keys.forEach(c => {
          errors = { ...errors, [c]: err.body.errors[c][0] };
        });
        this.props.showNotification('auth_error', {type: 'error', text: err.body.errors.full_messages[0]});
        throw new SubmissionError({ ...errors, _error: err.body.errors.full_messages[0] });
      } else {
        this.props.showNotification('auth_error', {type: 'error', text: err.body.error || err.body.errors[0] || 'Authorization error'});
        throw new SubmissionError({ _error: (err.body.error || err.body.errors[0] || '') });
      }
    });
  }

  handleResetPassword(data) {
    return this.props.resetPass(data).then((r) => {
      this.props.showNotification('pass_success', {text: r.message, type: 'success'});
      this.resetSuccess();
    }).catch((err) => {
      if (err.body.errors && err.body.errors.full_messages) {
        const errors_keys = Object.keys(err.body.errors);
        let errors = {};
        errors_keys.forEach(c => {
          errors = { ...errors, [c]: err.body.errors[c][0] };
        });
        this.props.showNotification('auth_error', {type: 'error', text: err.body.error.full_messages[0]});
        throw new SubmissionError({ ...errors, _error: err.body.errors.full_messages[0] });
      } else {
        this.props.showNotification('auth_error', {type: 'error', text: err.body.error || err.body.errors[0] || 'Authorization error'});
        throw new SubmissionError({ _error: (err.body.error || err.body.errors[0] || '') });
      }
    });
  }

  facebookAuth(r) {
    this.props.facebook_auth(r).then(() => {
      this.authSuccess();
    }, (err) => {
      if (err.body.errors && err.body.errors[0]) {
        this.props.showNotification('fb_error', {text: err.body.errors[0], type: 'error'});
      } else {
        this.props.showNotification('fb_error', {text: 'Authorization error', type: 'error'});
      }
    });
  }

  googleAuth(r) {
    this.props.google_auth({code: r}).then(() => {
      this.authSuccess();
    }, (err) => {
      if (err.body.errors && err.body.errors[0]) {
        this.props.showNotification('google_error', {text: err.body.errors[0], type: 'error'});
      } else {
        this.props.showNotification('google_error', {text: 'Authorization error', type: 'error'});
      }
    });
  }

  authSuccess() {
    if (this.props.not_modal) {
      this.props.replace(this.props.callbackUrl);
    } else {
      const { user } = this.props;

      if (user.email_present) this.props.authCallback();
      // don't show email popup when logging with the Sign In btn
      else if (!this.props.hidden_email_modal) this.props.showEmail(this.props.authCallback);

      this.props.closeModal();
    }
  }

  resetSuccess() {
    if (this.props.not_modal) {
      this.props.replace('/');
    } else {
      this.props.closeModal();
    }
  }

  render() {
    if (this.state.activeAuth === 'RESET') return <ResetPass {...this.props} onFormSubmit={this.handleResetPassword} changeAuthModal={() => this.changeAuthModal('SIGN_IN')} />;
    if (this.state.activeAuth === 'SIGN_IN') return <SignIn {...this.props} facebookAuth={this.facebookAuth} googleAuth={this.googleAuth} onFormSubmit={this.handleSingIn} changeAuthModal={() => this.changeAuthModal('SIGN_UP')} changeToReset={() => this.changeAuthModal('RESET')} />;
    return <SignUp {...this.props} facebookAuth={this.facebookAuth} googleAuth={this.googleAuth} onFormSubmit={this.handleSingUp} changeAuthModal={() => this.changeAuthModal('SIGN_IN')} />;
  }
}
