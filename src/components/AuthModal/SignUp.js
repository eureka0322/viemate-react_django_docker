import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Form, FacebookLogin, GoogleLogin, Loader } from 'elements';
import { Field, reduxForm } from 'redux-form';
import validate from './authValid';
import classNames from 'classnames';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

const SignUp = props => {
  const { submitting, error, handleSubmit, onFormSubmit, changeAuthModal, facebookAuth, googleAuth, loading } = props;

  return (
    <div className="sign-up">
      {loading && <Loader className="visible-xs" />}
      <div className="sign-up__content">
        <h5 className="sign-up__header">Sign up</h5>
        <div className="sign-up__btn-groups">
          <GoogleLogin callback={(r) => {googleAuth(r.getAuthResponse().access_token);}} className="form-button form-button--sign-up form-button--full-width form-button--circle form-button--grey">
            <span>
              <i className="icon icon--google" />
              <span>Continue with Google</span>
            </span>
          </GoogleLogin>
          <FacebookLogin callback={(r) => {facebookAuth(r);}} className="form-button form-button--sign-up form-button--full-width form-button--circle form-button--grey">
            <span>
              <i className="icon icon--facebook-circle" />
              <span>Continue with Facebook</span>
            </span>
          </FacebookLogin>
        </div>
        <div className="sign-up__title">
          <span>or by email</span>
        </div>
        <form className="sign-up__form" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="sign-up__form-item sign-up__form-item--fill">
            <Field
              classNameInput="form-control input input--base"
              disabled={submitting}
              name="sign_up_email"
              type="email"
              component={renderInput}
              placeholder="Email address"
              autoComplete
            />
          </div>
          <div className="sign-up__form-item sign-up__form-item--fill">
            <Field
              classNameInput="form-control input input--base"
              disabled={submitting}
              name="sign_up_password"
              type="password"
              component={renderInput}
              placeholder="Password"
            />
          </div>
          <div className="sign-up__form-item sign-up__form-item--fill">
            <Field
              classNameInput="form-control input input--base"
              disabled={submitting}
              name="first_name"
              type="text"
              component={renderInput}
              placeholder="First name"
              autoComplete
            />
          </div>
          <div className="sign-up__form-item sign-up__form-item--fill">
            <Field
              classNameInput="form-control input input--base"
              disabled={submitting}
              name="last_name"
              type="text"
              component={renderInput}
              placeholder="Last name"
              autoComplete
            />
          </div>
          <div className="sign-up__notice">
            By proceeding to create your account and use Viemate, you are agreeing to our
            <Link to="/terms_of_service" className="form-button form-button--link" onClick={() => {if (props.closeModal) props.closeModal();}}>
              <span>
                Terms of Service.
              </span>
            </Link>
          </div>
          <div className="sign-up__form-item">
            <button
              className={
                classNames('form-button form-button--circle form-button--full-width form-button--base-grey form-button--register', 'form-button--loader', {'form-button--loading': loading})
              }
              type="submit"
            >
              <span>Sign up</span>
            </button>
          </div>
          {error &&
            <div className="sign-up__form-item">
              <Form.Error message={error} />
            </div>
          }
          <div className="sign-up__separator" />
          <div className="sign-up__nav">
            <span className="item-text">Already a member?</span>
            <button
              className="form-button form-button--circle form-button--base-pink form-button--sign-in"
              type="button"
              onClick={changeAuthModal}
            >
              <span>Sign in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  changeAuthModal: PropTypes.func.isRequired,
  facebookAuth: PropTypes.func,
  googleAuth: PropTypes.func,
  closeModal: PropTypes.func,
  submitting: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
};

export default reduxForm({
  form: 'sign_up',
  touchOnBlur: false,
  validate
})(SignUp);
