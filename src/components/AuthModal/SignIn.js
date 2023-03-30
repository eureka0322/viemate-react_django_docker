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
  const { submitting, error, handleSubmit, onFormSubmit, changeAuthModal, changeToReset, facebookAuth, googleAuth, loading } = props;

  return (
    <div className="sign-up">
      {loading && <Loader className="visible-xs" />}
      <div className="sign-up__content">
        <h5 className="sign-up__header">Sign in</h5>
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
              name="password"
              type="password"
              component={renderInput}
              placeholder="Password"
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
              <span>Sign in</span>
            </button>

            <div className="sign-up__nav sign-up__nav--add-link">
              <Link to="#" className="item-text" onClick={e => {e.preventDefault(); changeToReset();}}>Forgot your password?</Link>
            </div>
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

SignUp.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  changeAuthModal: PropTypes.func.isRequired,
  changeToReset: PropTypes.func,
  submitting: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  facebookAuth: PropTypes.func,
  googleAuth: PropTypes.func,
};

export default reduxForm({
  form: 'sign_in',
  touchOnBlur: false,
  validate
})(SignUp);
