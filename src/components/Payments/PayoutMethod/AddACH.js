import React, { Component, PropTypes } from 'react';
import {reduxForm, Field} from 'redux-form';
import { connect } from 'react-redux';
import { Form } from 'elements';
import { createPayout } from 'redux/modules/payments';
import { showNotification } from 'redux/modules/notifications';
import validate from './achValidation';

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
  createPayout,
  showNotification
})
@reduxForm({
  form: 'add-ach',
  validate
})
export default class AddACH extends Component {
  static propTypes = {
    changeComponent: PropTypes.func,
    createPayout: PropTypes.func,
    handleSubmit: PropTypes.func,
    showNotification: PropTypes.func,
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
    return this.props.createPayout(data, 'ach').then(() => {
      this.props.changeComponent(null);
    }, () => {
      this.props.showNotification('payout_err', {text: 'Payout error', type: 'error'});
      this.props.changeComponent(null);
    });
  }

  render() {
    const {handleSubmit, submitting} = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.handleSubmit)} className="payment-container--small payouts credit-card credit-card__form">
          <h2 className="credit-card__title">Add new payout method</h2>
          { /* <div className="payouts__paypal-logo-wrap">
            <i className="icon icon--paypal" />
          </div> */}
          <div className="credit-card__ach">
            <div className="credit-card__items-wrap">
              <div className="credit-card__item credit-card__item--lg">
                <Field
                  classNameInput="input input--payout"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="name"
                  type="text"
                  // label="Addres line 1"
                  component={renderInput}
                  placeholder="Name on Account"
                />
              </div>
            </div>
          </div>
          <div className="credit-card__ach">
            <div className="credit-card__items-wrap">
              <div className="credit-card__item credit-card__item--lg">
                <Field
                  className="select-custom payouts__select form-select--currency"
                  disabled={submitting}
                  name="account_type"
                  list={[{label: 'Checking', value: 'checking'}, {label: 'Savings', value: 'savings'}]}
                  component={renderSelectbox}
                  placeholder="Account Type"
                />
              </div>
            </div>
          </div>
          <div className="credit-card__ach-group credit-card__ach">
            <div className="credit-card__items-wrap">
              <div className="credit-card__item credit-card__item--md">
                <Field
                  classNameInput="input input--payout"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="routing_number"
                  type="text"
                  // label="Addres line 1"
                  component={renderInput}
                  placeholder="Routing Number"
                />
              </div>
              <div className="credit-card__item credit-card__item--md">
                <Field
                  classNameInput="input input--payout"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="account_number"
                  type="text"
                  // label="Addres line 1"
                  component={renderInput}
                  placeholder="Account Number"
                />
              </div>
            </div>
          </div>
          <div className="credit-card__ach-img">
            <i className="icon icon--check" />
          </div>
          <div className="credit-card__btn-groups credit-card__btn-groups--ach-btns">
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
