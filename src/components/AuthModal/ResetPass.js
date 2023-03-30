import React, { PropTypes } from 'react';
// import { Link } from 'react-router';
import { Form } from 'elements';
import { Field, reduxForm } from 'redux-form';
import validate from './authValid';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

const ResetPass = props => {
  const { submitting, error, handleSubmit, onFormSubmit, changeAuthModal } = props;

  return (
    <div className="sign-up">
      <div className="sign-up__content">
        <h5 className="sign-up__header">Forgot Password</h5>
        <form className="sign-up__form" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="sign-up__form-item sign-up__form-item--fill">
            <Field
              classNameInput="form-control input input--base"
              disabled={submitting}
              name="email"
              type="email"
              component={renderInput}
              placeholder="Email address"
              autoComplete
            />
          </div>
          <div className="sign-up__form-item">
            <button className="form-button form-button--circle form-button--full-width form-button--base-grey form-button--register" type="submit">
              <span>Reset</span>
            </button>
          </div>
          {error &&
            <div className="sign-up__form-item">
              <Form.Error message={error} />
            </div>
          }
          <div className="sign-up__separator" />
          <div className="sign-up__nav">
            <span to="#" className="item-text">
              {'Don\'t have an account?'}
            </span>
            <button
              className="form-button form-button--circle form-button--base-pink form-button--sign-in"
              type="button"
              onClick={changeAuthModal}
            >
              <span>Sign up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ResetPass.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  changeAuthModal: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default reduxForm({
  form: 'sign_in',
  touchOnBlur: false,
  validate
})(ResetPass);
