import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { PostHeader } from '.';
import { Form } from 'elements';
import { reduxForm, Field } from 'redux-form';
import PostFormValidation from './PostFormValidation';
import { scrollToFirstError } from 'utils/helpers';

const renderCheckbox = field =>
  <Form.Checkbox
    field={field}
    {...field}
  />;

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

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

const onDateChange = val => {
  console.log(val);
};

@connect(
  state => ({
    errors: state.formErrors,
  })
)
@reduxForm({
  form: 'form-manage-post',
  validate: PostFormValidation,
  destroyOnUnmount: false,
  // enableReinitialize: true,
  onSubmitFail: (errors) => {
    // header height 72px + extraheight === 92px
    scrollToFirstError(errors, 92);
  }
})
export default class PostFormBasics extends Component {
  static propTypes = {
    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    error: PropTypes.string,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool,
    reset: PropTypes.func.isRequired,
    // dispatch: PropTypes.func,
    submitting: PropTypes.bool.isRequired,
    // valid: PropTypes.bool.isRequired
  };

  render() {
    const { handleSubmit, error, reset, submitting, pristine, errors } = this.props;
    // console.log(this.props);

    return (
      <div>
        <PostHeader className="icon--information" title="Tell us about your place" subtitle="Price, dates and more" />
        <form className="post-form" action="" method="post" onSubmit={handleSubmit}>
          <div className="post-form__section post-form__section--above-radio">
            <div className="post-form__location">
              <div className="post-form__item post-form__item--place">
                <Field
                  classNameInput="form-control input input--location input--count"
                  classNameLabel="post-form__label"
                  disabled={submitting}
                  name="title"
                  type="text"
                  component={renderInput}
                  label="Name your place"
                  placeholder=""
                  maxLength={60}
                />
              </div>
              <div className="post-form__item post-form__item--price">
                <Field
                  classNameInput="form-control input input--price"
                  classNameLabel="post-form__label"
                  disabled={submitting}
                  name="price"
                  type="text"
                  component={renderInput}
                  label="Price per month"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
          <div className="post-form__section post-form__section--type-user">
            <div className="post-form__label post-form__label--type-user-label">I am ...</div>
            <div className={'form-radio__group post-form__wrapper-element ' + (errors.place_type ? 'group-has-error' : '')}>
              <Field
                classNameIcon="form-radio__icon form-radio__icon--black"
                classNameCaption="form-radio__label form-radio__label--caption"
                classNameLabel="form-radio__label"
                name="user_type"
                type="radio"
                component={renderRadio}
                label="a broker/agent"
                caption="If you are a licensed agent or broker"
                value="broker"
                disabled={submitting}
              />
              <Field
                classNameIcon="form-radio__icon form-radio__icon--black"
                classNameCaption="form-radio__label form-radio__label--caption"
                classNameLabel="form-radio__label"
                name="user_type"
                type="radio"
                component={renderRadio}
                label="Current tenant / landlord"
                caption="If you are renting a place you leased"
                value="tenant"
                disabled={submitting}
              />
            </div>
            {errors.place_type && <Form.RadioMessage field={'place_type'} />}
          </div>
          <div className="post-form__section post-form__section--checkbox-group">
            <div className="post-form__label post-form__label--checkbox-title">Lease type</div>
            <div className="post-form__container">
              <div className={'form-checkbox__checkbox-group post-form__wrapper-element filter-form--rent-type' + (errors.lease_type ? ' group-has-error' : '')}>
                <Field
                  classNameIcon="form-checkbox__icon form-checkbox__icon--pink"
                  classNameCaption="form-checkbox__label form-checkbox__label--caption"
                  classNameLabel="form-checkbox__label"
                  disabled={submitting}
                  name="lease_type_new"
                  type="checkbox"
                  component={renderCheckbox}
                  label="New lease"
                  caption="Typically 12 months, maybe more less."
                  multipleValidationName="lease_type"
                />
                <Field
                  classNameIcon="form-checkbox__icon form-checkbox__icon--pink"
                  classNameCaption="form-checkbox__label form-checkbox__label--caption"
                  classNameLabel="form-checkbox__label"
                  disabled={submitting}
                  name="lease_type_take_over"
                  type="checkbox"
                  component={renderCheckbox}
                  label="Lease takeover"
                  caption="If you are looking for someone to takeover your entire apartment or just a room. "
                  multipleValidationName="lease_type"
                />
                <Field
                  classNameIcon="form-checkbox__icon form-checkbox__icon--pink"
                  classNameCaption="form-checkbox__label form-checkbox__label--caption"
                  classNameLabel="form-checkbox__label"
                  disabled={submitting}
                  name="lease_type_temporary"
                  type="checkbox"
                  component={renderCheckbox}
                  label="Temporary sublet"
                  caption="If you are leaving the city for few vacation."
                  multipleValidationName="lease_type"
                />
              </div>
              {errors.lease_type && <Form.RadioMessage field={'lease_type'} />}
            </div>
          </div>
          <div className="post-form__section post-form__section--calendar">
            <div className="post-form__calendar">
              <div className="post-form__item post-form__item--date-available">
                <div className="post-form__label post-form__label--calendar date-range-picker__label-wrap date-range-picker__label-wrap--start">Available on</div>
                <div className="form-radio__group post-form__wrapper-element">
                  <Field
                    classNameIcon="form-checkbox__icon form-checkbox__icon--pink"
                    classNameCaption="form-checkbox__label form-checkbox__label--caption"
                    classNameLabel="form-checkbox__label"
                    disabled={submitting}
                    name="available_on_now"
                    type="checkbox"
                    component={renderCheckbox}
                    label="Now"
                  />
                </div>
              </div>
              <div className="post-form__item post-form__item--date-select">
                <Form.DateRangePicker
                  name="dates_range"
                  numberOfMonths={1}
                  startDateId="start_date"
                  endDateId="end_date"
                  startDateLabel="Or select a date"
                  endDateLabel="To (optional)"
                  minimumNights={30}
                  moveToFocus
                  cbFunction={onDateChange}
                />
              </div>
            </div>
          </div>
          <div className="post-form__section post-form__description">
            <div className="form-group post-form__item">
              <Field
                classNameLabel="post-form__label"
                className="textarea--count"
                disabled={submitting}
                name="description"
                component={renderTextarea}
                label="Description"
                placeholder="What would you like tenants or roommates to know about your place?"
                maxLength={2000}
                row={5}
              />
            </div>
          </div>
          <div className="post-form__section post-form__nav post-form__nav--step-1">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark"
              disabled={pristine || submitting}
              onClick={reset}
              type="button"
            >
              <span>Reset</span>
            </Form.Button>

            <Form.Button
              className="form-button form-button--user-action form-button--circle form-button--pink"
              disabled={pristine || submitting}
              type="submit"
            >
              <span>Next</span>
            </Form.Button>

            {error ? <Form.Alert title={error || ''} className="alert-danger" /> : null}
          </div>
        </form>

      </div>

    );
  }
}
