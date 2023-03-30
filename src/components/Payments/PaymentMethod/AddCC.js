import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { CreditCard } from 'components';
import { loadBraintreeToken, createBraintreePayment } from 'redux/modules/payments';
import { showNotification } from 'redux/modules/notifications';
import { Loader } from 'elements';

@connect(st => ({
  loading: st.payments.braintree_loading,
  token: st.payments.braintree_token,
}), {
  loadBraintreeToken,
  createBraintreePayment,
  showNotification,
})
export default class PaymentBraintree extends Component {
  static propTypes = {
    token: PropTypes.string,
    loadBraintreeToken: PropTypes.func,
    changeComponent: PropTypes.func,
    createBraintreePayment: PropTypes.func,
    showNotification: PropTypes.func,
    loading: PropTypes.bool,
  };

  constructor() {
    super();
    this.onSuccess = ::this.onSuccess;
    this.onError = ::this.onError;
    this.showNotification = ::this.showNotification;
  }

  componentDidMount() {
    this.props.loadBraintreeToken().catch((err) => {
      console.error(err);
      this.props.showNotification('payment_err', {text: 'Payment error', type: 'error'});
      this.props.changeComponent(null);
    });
  }

  onSuccess(nonce, data) {
    this.props.createBraintreePayment({nonce, ...data}).then(() => {
      this.props.showNotification('payment_added', {text: 'Payment method has been successfully added', type: 'success'});
      this.props.changeComponent(null);
    }, (err) => {
      if (err.body && err.body.errors && err.body.errors[0] && typeof err.body.errors[0].message === 'string') {
        this.props.showNotification('payment_err', {text: err.body.errors[0].message, type: 'error'});
      } else {
        this.props.showNotification('payment_err', {text: 'Payment error', type: 'error'});
      }
      this.props.changeComponent(null);
    });
  }

  onError(message) {
    this.props.showNotification('payment_err', {text: message, type: 'error'});
    this.props.changeComponent(null);
  }

  showNotification(message) {
    this.props.showNotification('payment_err', {text: message, type: 'error'});
  }

  render() {
    const {token, loading} = this.props;
    return (
      <div className="payment-container payment-container--small">
        {loading && <Loader />}
        {token && <CreditCard token={token} changeComponent={this.props.changeComponent} onSuccess={this.onSuccess} onError={this.onError} showNotification={this.showNotification} />}
      </div>
    );
  }
}
