import React, { Component, PropTypes } from 'react';
import {} from './SignUp.scss';
import { Link } from 'react-router';
import { Form } from 'elements';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { register } from 'redux/modules/auth';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

@connect(() => ({}), {
  register,
})

@reduxForm({
  form: 'form-manage-post',
})

export default class SignUp extends Component {
  static propTypes = {
    register: PropTypes.func,
    closeModal: PropTypes.func,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    // valid: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    return this.props.register(data).then((r) => {
      if (r.errors) {
        throw new SubmissionError({ _error: r.errors.full_messages[0] });
      } else {
        this.props.closeModal();
      }
    }, (err) => {
      throw new SubmissionError({ _error: err.body.error });
    });
  }

  render() {
    const { submitting, handleSubmit, error } = this.props;
    return (
      <div className="sign-up">
        <div>
          <h5 className="sign-up__header">Sign up</h5>
          <div className="sign-up__content">
            <div className="sign-up__btn-groups">
              <Link to="#" className="form-button form-button--sign-up form-button--full-width form-button--circle form-button--grey">
                <span>
                  <i className="icon icon--google" />
                  <span>Continue with Google</span>
                </span>
              </Link>
              <Link to="#" className="form-button form-button--sign-up form-button--full-width form-button--circle form-button--grey">
                <span>
                  <i className="icon icon--facebook-circle" />
                  <span>Continue with Facebook</span>
                </span>
              </Link>
            </div>
            <div className="sign-up__title">
              <span>or by email</span>
            </div>
            <form className="sign-up__form" onSubmit={handleSubmit(this.handleSubmit)}>
              <div className="sign-up__form-item">
                <Field
                  classNameInput="form-control input input--base"
                  disabled={submitting}
                  name="email"
                  type="email"
                  component={renderInput}
                  placeholder="Email address"
                />
              </div>
              <div className="sign-up__form-item">
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
                <Link to="#" className="form-button form-button--link">
                  <span>
                    Terms of Service.
                  </span>
                </Link>
              </div>
              <div className="sign-up__form-item">
                <button className="form-button form-button--circle form-button--full-width form-button--base-grey form-button--register" type="submit">
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
                <Link to="#" className="form-button form-button--clear item-text">
                  Already a member?
                </Link>
                <button className="form-button form-button--base-pink form-button--sign-in" type="button">
                  <span>Sign in</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}
