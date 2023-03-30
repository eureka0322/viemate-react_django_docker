import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { Form } from 'elements';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import validate from './emailValid';
import classNames from 'classnames';
import { updateProfile } from 'redux/modules/profile';
import { showNotification } from 'redux/modules/notifications';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

@connect(
  st => ({
    emailCallback: st.modals.emailCallback,
    user: st.auth.user
  }),
  {
    updateProfile,
    replace,
    showNotification
  }
)
@reduxForm({
  form: 'email_modal',
  touchOnBlur: false,
  validate
})
export default class EmailModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    emailCallback: PropTypes.func,
    closeModal: PropTypes.func,
    replace: PropTypes.func,
    updateProfile: PropTypes.func,
    showNotification: PropTypes.func,
    submitting: PropTypes.bool,
    not_modal: PropTypes.bool,
    callbackUrl: PropTypes.string,
    error: PropTypes.string,
    user: PropTypes.object
  };

  constructor() {
    super();
    this.handleSubmit = ::this.handleSubmit;
    this.emailSuccess = ::this.emailSuccess;
  }

  emailSuccess() {
    if (this.props.not_modal) {
      this.props.replace(this.props.callbackUrl || '/');
    } else {
      this.props.emailCallback();
      this.props.closeModal();
    }
  }

  handleSubmit(data) {
    const userId = this.props.user.id;

    data = {
      ...data
    };
    delete data.email_confirm;

    // console.log('SUBMIT_DATA', data);
    // console.log('USER', this.props.user);

    return this.props.updateProfile({user: data}, userId)
      .then(() => this.emailSuccess())
      .catch(err => {
        if (err.body.errors && err.body.errors.full_messages) {
          const errors_keys = Object.keys(err.body.errors);
          let errors = {};
          errors_keys.forEach(c => {
            errors = { ...errors, [c]: err.body.errors[c][0] };
          });
          this.props.showNotification('email_error', {type: 'error', text: err.body.errors.full_messages[0]});
          throw new SubmissionError({ ...errors, _error: err.body.errors.full_messages[0] });
        } else {
          this.props.showNotification('email_error', {type: 'error', text: err.body.error || err.body.errors[0] || 'Email saving error'});
          throw new SubmissionError({ _error: (err.body.error || err.body.errors[0] || 'Email saving error') });
        }
      });
  }

  render() {
    const { submitting, handleSubmit, error } = this.props;

    return (
      <div className="sign-up sign-up--no-email">
        <div className="sign-up__content">
          <h5 className="sign-up__header">{'Oops! We don\'t have your email!'}</h5>
          <form className="sign-up__form" onSubmit={handleSubmit(this.handleSubmit)}>
            <div className="sign-up__notice">
              Before using more functions, we need your email to notify you. We will not spam you :)
            </div>
            <div className="sign-up__form-item sign-up__form-item--fill">
              <Field
                classNameInput="form-control input input--base"
                disabled={submitting}
                name="email"
                type="email"
                component={renderInput}
                autoComplete
                placeholder="Email address"
              />
            </div>
            <div className="sign-up__form-item sign-up__form-item--fill">
              <Field
                classNameInput="form-control input input--base"
                disabled={submitting}
                name="email_confirm"
                type="email"
                component={renderInput}
                autoComplete
                placeholder="Confirm email address"
              />
            </div>
            <div className="sign-up__form-item">
              <button
                className={
                  classNames('form-button form-button--circle form-button--full-width form-button--base-grey form-button--register', 'form-button--loader', {'form-button--loading': submitting})
                }
                disabled={submitting}
                type="submit"
              >
                <span>Save</span>
              </button>
            </div>
            {error &&
              <div className="sign-up__form-item">
                <Form.Error message={error} />
              </div>
            }
          </form>
        </div>
      </div>
    );
  }
}
