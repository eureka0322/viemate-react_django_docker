import React, { Component, PropTypes } from 'react';
import {reduxForm, Field, getFormValues} from 'redux-form';
import { connect } from 'react-redux';
import { Form } from 'elements';

const renderRadio = (field) =>
  <Form.Radio
    field={field}
    {...field}
  />;

@connect(st => ({
  form_values: getFormValues('add-payment-select')(st) || {}
}), {})
@reduxForm({
  form: 'add-payment-select',
})
export default class AddPayment extends Component {
  static propTypes = {
    form_values: PropTypes.object,
    changeComponent: PropTypes.func,
    pristine: PropTypes.bool,
  }

  render() {
    const {changeComponent, form_values, pristine} = this.props;

    return (
      <div>
        <form className="payments__form">
          <div className="table table-responsive table__payment-method table__payment-method--add-payment payments__table payments__table">
            <div className="table__header">
              <div className="table__row">
                <div className="table__header-item table__cell">Method</div>
                <div className="table__header-item table__cell">Details</div>
              </div>
            </div>
            <div className="table__body">
              <div className="table__row">
                <div className="form-radio__group form-radio--payment-method table__cell">
                  <div className="table__mob-row-ttl table__mob-row-ttl--method">Method</div>
                  <Field
                    classNameIcon="form-radio__icon form-radio__icon--black"
                    classNameLabel="form-radio__label form-radio__label--payment"
                    name="method"
                    type="radio"
                    component={renderRadio}
                    label="Credit card"
                    value="credit_card"
                  />
                </div>
                <div className="table__cell">
                  <div className="table__mob-row-ttl table__mob-row-ttl--details">Details</div>
                  <div className="payments__method-title">Accepted credit cards</div>
                  <ul className="payments__method-lists">
                    <li>
                      <i className="icon icon--visa" />
                    </li>
                     <li>
                      <i className="icon icon--discover" />
                    </li>
                    <li>
                      <i className="icon icon--american-express" />
                    </li>
                    <li>
                      <i className="icon icon--master-card" />
                    </li>
                  </ul>
                </div>
              </div>
              {/*<div className="table__row">
                <div className="form-radio__group form-radio--payment-method table__cell">
                  <div className="table__mob-row-ttl table__mob-row-ttl--method">Method</div>
                  <Field
                    classNameIcon="form-radio__icon form-radio__icon--black"
                    classNameLabel="form-radio__label form-radio__label--payment"
                    name="method"
                    type="radio"
                    component={renderRadio}
                    label="PayPal"
                    value="paypal"
                  />
                </div>
                <div className="table__cell">
                  <div className="table__mob-row-ttl table__mob-row-ttl--details">Details</div>
                  <i className="icon icon--paypal-md" />
                </div>
              </div>*/}
              <div className="table__row">
                <div className="table__cell">
                  <div className="table__mob-row-ttl table__mob-row-ttl--method">Method</div>
                  <div className="form-radio__group form-radio--payment-method">
                    <Field
                      classNameIcon="form-radio__icon form-radio__icon--black"
                      classNameLabel="form-radio__label form-radio__label--payment"
                      name="method"
                      type="radio"
                      component={renderRadio}
                      label="Direct Deposit (ACH)"
                      value="ach"
                    />
                  </div>
                  <div className="table__mob-row-ttl table__mob-row-ttl--details">Details</div>
                  <div className="payments__mob-descr">Pay with your bank account</div>
                </div>
                <div className="table__cell" />
              </div>
            </div>
          </div>
        </form>
        <div className="payments__nav">
          <Form.Button
            className="form-button--circle form-button--pink form-button--payments-procedure"
            type="button"
            onClick={() => changeComponent(form_values.method)}
            disabled={pristine}
          >
            <span>Add Payment</span>
          </Form.Button>
        </div>
      </div>
    );
  }
}
