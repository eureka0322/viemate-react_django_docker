import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import config from 'config';
import { connect } from 'react-redux';
import { Form } from 'elements';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { scrollToFirstError } from 'utils/helpers';
import { replace } from 'react-router-redux';
import { changePass, load } from 'redux/modules/auth';
import { showNotification } from 'redux/modules/notifications';
import validate from './validation';
import {} from './resetPass.scss';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

@connect(state => ({
  user: state.auth.user,
}), {
  changePass,
  showNotification,
  replace,
  load
})
@reduxForm({
  form: 'password_reset',
  validate,
  onSubmitFail: (errors) => {
    scrollToFirstError(errors, 80);
  }
})
export default class ResetPass extends Component {
  static propTypes = {
    location: PropTypes.object,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    changePass: PropTypes.func,
    showNotification: PropTypes.func,
    replace: PropTypes.func,
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    load: PropTypes.func,
    error: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    const {location: {query}} = this.props;
    if (!!query && query.uid && query.client_id && query.expiry && query.token) {
      const now = query.expiry ? new Date(query.expiry * 1000) : 'session';
      cookie.save('uid', query.uid, { path: '/', expires: now });
      cookie.save('client', query.client_id, { path: '/', expires: now });
      cookie.save('access-token', query.token, { path: '/', expires: now });
    }
    return this.props.changePass(data).then((r) => {
      this.props.load().then(() => {
        this.props.showNotification('pass_success', {text: r.message, type: 'success'});
        this.props.replace('/');
      });
    }, (err) => {
      cookie.remove('uid');
      cookie.remove('client');
      cookie.remove('access-token');
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
    const {submitting, handleSubmit, reset, pristine, error} = this.props;
    return (
      <div className="reset-password">
        <Helmet {...config.app.head} />
          <div className="container container--md-width">
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
                {error &&
                  <div className="sign-up__form-item">
                    <Form.Error message={error} />
                  </div>
                }
                <div className="settings__btn-groups">
                  <Form.Button
                    className="form-button form-button--setting-action form-button--default-dark"
                    type="button"
                    disabled={submitting || pristine}
                    onClick={reset}
                  >
                    <span>{'Cancel'}</span>
                  </Form.Button>
                  <Form.Button
                    className="form-button form-button--setting-action form-button--circle form-button--pink"
                    type="submit"
                    disabled={submitting || pristine}
                  >
                    <span>{'Save'}</span>
                  </Form.Button>
                </div>
              </form>
            </div>
          </div>
      </div>
    );
  }
}
