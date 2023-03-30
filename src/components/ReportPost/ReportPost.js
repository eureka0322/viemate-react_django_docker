import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import {connect} from 'react-redux';
import {reportSpam} from 'redux/modules/spamReport';
import validate from './validate';
import classNames from 'classnames';

const renderCheckbox = field =>
  <Form.Checkbox
    field={field}
    {...field}
  />;

const ReportPostTextarea = field =>
  <Form.Textarea
    field={field}
    {...field}
  />;

@connect((st) => ({
  reporting: st.spamReport.reporting,
}), {
  reportSpam,
})
@reduxForm({
  form: 'form-send-email',
  validate,
  touchOnBlur: false,
})
export default class ReportPost extends Component {
  static propTypes = {
    // register: PropTypes.func,
    closeModal: PropTypes.func,
    reportSpam: PropTypes.func,
    reporting: PropTypes.bool,
    // redux-form
    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    // errors: PropTypes.object,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    id: PropTypes.number,
    // valid: PropTypes.bool.isRequired
  };

  constructor() {
    super();
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    this.props.reportSpam(this.props.id, data).then((r) => {
      this.props.closeModal();
      return r;
    }).catch((err) => {
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
    const {pristine, handleSubmit, submitting, error, reporting} = this.props;
    return (
      <div className="message-container message-container--popup">
        <div className="message-container__wrapper">
          <h1 className="message-container__title">Report this post</h1>
          <form onSubmit={handleSubmit(this.handleSubmit)} className="message-container__form">
            <div className="post-form__container post-form__wrapper-element message-container__form-item">
              <div className="form-checkbox__checkbox-group">
                <Field
                  classNameIcon="form-checkbox__icon form-checkbox__icon--black"
                  classNameCaption="form-checkbox__label form-checkbox__label--caption"
                  classNameLabel="form-checkbox__label"
                  // disabled={submitting}
                  name="is_spam"
                  type="checkbox"
                  component={renderCheckbox}
                  label="This is a spam"
                  caption="Photos or address are fake."
                />
                <Field
                  classNameIcon="form-checkbox__icon form-checkbox__icon--black"
                  classNameCaption="form-checkbox__label form-checkbox__label--caption"
                  classNameLabel="form-checkbox__label"
                  // disabled={submitting}
                  name="asked_money"
                  type="checkbox"
                  component={renderCheckbox}
                  label="Asked me to wire money"
                  caption="Did this user ask you to transfer money via a third party?"
                />
              </div>
            </div>
            <div className="message-container__textarea message-container__textarea--report">
              <Field
                name="body"
                component={ReportPostTextarea}
                placeholder="Did this user ask you to transfer money via a third party?"
              />
            </div>
            {error &&
              <div className="post-form__container post-form__wrapper-element message-container__form-item">
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
                <button className={classNames('form-button form-button--pink form-button--circle form-button--user-action', 'form-button--loader', {'form-button--loading': reporting})} disabled={pristine || submitting || reporting} type="submit">
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
