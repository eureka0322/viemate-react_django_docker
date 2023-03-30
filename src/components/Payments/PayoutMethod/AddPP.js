import React, { Component, PropTypes } from 'react';
import {reduxForm, Field} from 'redux-form';
import { connect } from 'react-redux';
import { Form } from 'elements';
import { createPayout } from 'redux/modules/payments';
import validate from './ppValidation';

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
@connect(() => ({}), {
  createPayout
})
@reduxForm({
  form: 'add-pp',
  initialValues: {currency: 'USD'},
  validate
})
export default class AddPP extends Component {
  static propTypes = {
    changeComponent: PropTypes.func,
    createPayout: PropTypes.func,
    handleSubmit: PropTypes.func,
    // closeModal: PropTypes.func,
    // saveAddress: PropTypes.func,
    submitting: PropTypes.bool
  }

  handleSubmit = (data) => {
    // this.props.saveAddress(data).then(r => {
    //   this.props.closeModal();
    //   this.props.changeComponent();
    //   return r;
    // });
    return this.props.createPayout(data, 'paypal').then((r) => {
      this.props.changeComponent(null);
      return Promise.resolve(r);
    });
  }

  render() {
    const {handleSubmit, submitting} = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.handleSubmit)} className="payment-container--small payouts credit-card credit-card__form">
          <h2 className="credit-card__title">Add new payout method</h2>
          <div className="payouts__paypal-logo-wrap">
            <i className="icon icon--paypal" />
          </div>
          <div className="credit-card__form-section">
            <span className="credit-card__text">Your Paypal email</span>
            <div className="credit-card__items-wrap">
              <div className="credit-card__item credit-card__item--lg">
                <Field
                  classNameInput="input input--base"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="email"
                  type="email"
                  // label="Addres line 1"
                  component={renderInput}
                  placeholder="Email"
                />
              </div>
            </div>
          </div>
          <div className="credit-card__form-section">
            <span className="credit-card__text">Currency</span>
            <div className="credit-card__items-wrap">
              <div className="credit-card__item credit-card__item--lg">
                <Field
                  className="select-custom payouts__select form-select--currency"
                  disabled={submitting}
                  name="currency"
                  list={[{label: 'USD', value: 'USD'}, {label: 'EUR', value: 'EUR'}]}
                  component={renderSelectbox}
                  placeholder="Currency"
                />
              </div>
            </div>
          </div>
          <div className="credit-card__btn-groups">
            <Form.Button
              className="form-button form-button--card-action form-button--default-dark form-button--circle"
              type="button"
              onClick={() => this.props.changeComponent(null)}
            >
              <span>Cancel</span>
            </Form.Button>
            <Form.Button
              className={'form-button form-button--capitalize form-button--card-action form-button--circle form-button--pink form-button--loader' + (submitting ? ' form-button--loading' : '')}
              type="submit"
            >
              <span>Finish</span>
            </Form.Button>
          </div>
        </form>
      </div>
    );
  }
}
