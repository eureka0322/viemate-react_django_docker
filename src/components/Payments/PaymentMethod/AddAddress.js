import React, { Component, PropTypes } from 'react';
import {reduxForm, Field} from 'redux-form';
import { Form } from 'elements';
import payment_countries from 'utils/payment_countries';
import validate from './addressValidation';

const normalizeNumber = (value) => {
  if (!value) return value;
  return value.replace(/[^a-zA-Z0-9-]*$/g, '').slice(0, 9);
};

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

@reduxForm({
  form: 'add-address',
  validate
})
export default class AddPayment extends Component {
  static propTypes = {
    changeComponent: PropTypes.func,
    handleSubmit: PropTypes.func,
    closeModal: PropTypes.func,
    saveAddress: PropTypes.func,
    submitting: PropTypes.bool,
    title: PropTypes.string
  }

  handleSubmit = (data) => {
    this.props.saveAddress(data).then(r => {
      this.props.closeModal();
      this.props.changeComponent();
      return r;
    });
  }

  render() {
    const { handleSubmit, submitting, title } = this.props;

    return (
      <div className="message-container">
        <form onSubmit={handleSubmit(this.handleSubmit)} className="add-payment__form">
          <div className="table table--add-payment">
            <div className="table__header table__header-ttl">
              {title || 'Add payment method'}
            </div>
            <div className="table__body">
              <div className="table__row">
                <Field
                  className="select-custom add-payment__select"
                  disabled={submitting}
                  name="country_name"
                  list={payment_countries.map(c => ({label: c, value: c}))}
                  component={renderSelectbox}
                  label="User Roles"
                  searchable
                  placeholder="Country"
                />
              </div>
              <div className="table__row">
                <Field
                  classNameInput="form-control input input--default input--setting"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="street_address"
                  type="text"
                  // label="Addres line 1"
                  component={renderInput}
                  placeholder="Street address"
                />
              </div>
              <div className="table__row">
                <Field
                  classNameInput="form-control input input--default input--setting"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="extended_address"
                  type="text"
                  // label="Addres line 2"
                  component={renderInput}
                  placeholder="Extended address"
                />
              </div>
              <div className="table__row table__row--half">
                <Field
                  classNameInput="form-control input input--default input--setting"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="locality"
                  type="text"
                  // label="City"
                  component={renderInput}
                  placeholder="City"
                />
              </div>
              <div className="table__row table__row--half table__row--right">
                <Field
                  classNameInput="form-control input input--default input--setting"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="region"
                  type="text"
                  // label="State"
                  component={renderInput}
                  placeholder="State"
                />
              </div>
              <div className="table__row table__row--half">
                <Field
                  classNameInput="form-control input input--default input--setting"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="postal_code"
                  type="text"
                  // label="Zipcode"
                  component={renderInput}
                  normalize={normalizeNumber}
                  placeholder="Zipcode"
                />
              </div>
            </div>
          </div>
          <div className="payments__nav">
            <Form.Button
              className="form-button--circle form-button--default-dark form-button--payments-procedure"
              type="button"
              onClick={this.props.closeModal}
            >
              <span>Cancel</span>
            </Form.Button>
            <Form.Button
              className="form-button--circle form-button--pink form-button--payments-procedure"
              type="submit"
            >
              <span>Next</span>
            </Form.Button>
          </div>
        </form>
      </div>
    );
  }
}
