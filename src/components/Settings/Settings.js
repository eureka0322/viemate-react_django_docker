import React, { Component, PropTypes } from 'react';
import {} from './Settings.scss';
import { connect } from 'react-redux';
import { Form } from 'elements';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import PhoneVerify from './PhoneVerify';
import IdVerify from './IdVerify';
import settingsValidation from './settingsValidation';
import { scrollToFirstError } from 'utils/helpers';
import { changePass } from 'redux/modules/auth';
import { showNotification } from 'redux/modules/notifications';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

@connect(state => ({
  user: state.auth.user,
}), {
  changePass,
  showNotification
})
@reduxForm({
  form: 'profile_settings',
  validate: settingsValidation,
  onSubmitFail: (errors) => {
    scrollToFirstError(errors, 80);
  }
})

export default class Settings extends Component {
  static propTypes = {
    changePass: PropTypes.func,
    showNotification: PropTypes.func,

    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    // errors: PropTypes.object,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    // valid: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    // console.log(data);
    return this.props.changePass(data).then((r) => {
      this.props.reset();
      this.props.showNotification('pass_success', {text: r.message, type: 'success'});
    }, (err) => {
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
    const { submitting, handleSubmit, pristine, reset } = this.props;

    return (
      <div className="settings">
        <form className="settings__form" onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="settings__item-form">
            <Field
              classNameInput="form-control input input--default input--setting"
              classNameLabel="settings__label-form"
              disabled={submitting}
              name="password"
              type="password"
              label="Change password"
              component={renderInput}
              placeholder=""
            />
          </div>
          <div className="settings__item-form">
            <Field
              classNameInput="form-control input input--default input--setting"
              classNameLabel="settings__label-form"
              disabled={submitting}
              name="password_confirmation"
              type="password"
              label="Re-type your password"
              component={renderInput}
              placeholder=""
            />
          </div>
          <div className="settings__btn-groups">
            <Form.Button
              className="form-button form-button--setting-action form-button--default-dark"
              type="button"
              disabled={submitting || pristine}
              onClick={() => reset()}
            >
              <span>Cancel</span>
            </Form.Button>
            <Form.Button
              className="form-button form-button--setting-action form-button--circle form-button--pink"
              type="submit"
              disabled={submitting || pristine}
            >
              <span>Save</span>
            </Form.Button>
          </div>
          <PhoneVerify />
          <IdVerify />
        </form>
      </div>
    );
  }

}
