import React, { Component, PropTypes } from 'react';
import {} from './Feedback.scss';
import { Form } from 'elements';
import { reduxForm, Field } from 'redux-form';
import feedbackValidation from './feedbackValidation';

const renderTextarea = field =>
  <Form.Textarea
    field={field}
    {...field}
  />;

const renderRadio = field =>
  <Form.Radio
    field={field}
    {...field}
  />;

@reduxForm({
  form: 'form-feedback',
  validate: feedbackValidation
})
export default class Feedback extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    deactivate: PropTypes.func,
    setStatus: PropTypes.func,
    updateProduct: PropTypes.func,
    toggleFeedbackModal: PropTypes.func,
    submitting: PropTypes.bool,
    errors: PropTypes.object
  };

  constructor() {
    super();
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    const { deactivate, setStatus, updateProduct, updateProducts, updateUsers, toggleFeedbackModal } = this.props; // eslint-disable-line

    data = {
      ...data,
      question1: data.question1 === 'true' || false
    };
    // console.log('SUBMIT_DATA', data);

    return deactivate(data)
      .then(r => {
        if (setStatus) setStatus(r.post); // list manage posts
        if (updateProduct) updateProduct(r.post); // cur product
        if (updateProducts) updateProducts(r.post); // list offered products
        if (updateUsers) updateUsers(r.post); // list wanted products

        toggleFeedbackModal();
      })
      .catch(err => console.log(err));
  }

  render() {
    const { handleSubmit, submitting, errors } = this.props;

    return (
      <div className="feedback-form">
        <div className="feedback-form__title">Have we been helpful in assisting you?</div>
        <form className="feedback-form__form-container" onSubmit={handleSubmit(this.handleSubmit)}>
          <div className={'feedback-form__radio-group' + (errors.question1 ? ' group-has-error' : '')}>
            <Field
              classNameIcon="form-radio__icon form-radio__icon--white"
              classNameLabel="form-radio__label form-radio__label--grey"
              disabled={submitting}
              name="question1"
              type="radio"
              component={renderRadio}
              label="Yes"
              value="true"
            />
            <Field
              classNameIcon="form-radio__icon form-radio__icon--white"
              classNameLabel="form-radio__label form-radio__label--grey"
              disabled={submitting}
              name="question1"
              type="radio"
              component={renderRadio}
              label="No"
              value="false"
            />
            {errors.question1 && <Form.RadioMessage field={'question1'} />}
          </div>
          <div className="feedback-form__textarea feedback-form__textarea--new-message">
            <Field
              className="textarea--feedback"
              disabled={submitting}
              name="body"
              component={renderTextarea}
              placeholder="Please, if you have time tell us how we can improve viemate :) "
              row={6}
            />
          </div>
          <div className="feedback-form__btn">
            <button
              className={'form-button form-button--pink form-button--circle form-button--user-action form-button--loader' + (submitting ? ' form-button--loading' : '')}
              type="submit"
              disabled={submitting}
            >
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    );
  }
}
