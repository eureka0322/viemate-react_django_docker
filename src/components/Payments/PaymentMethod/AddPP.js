import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { PayPal } from 'components';
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
export default class AddPP extends Component {
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
      this.props.changeComponent('');
    });
  }

  onSuccess(nonce) {
    this.props.createBraintreePayment({nonce}).then(() => {
      this.props.showNotification('payment_added', {text: 'Payment method has been successfully added', type: 'success'});
      this.props.changeComponent(null);
    }, () => {
      this.props.showNotification('payment_err', {text: 'Payment error', type: 'error'});
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
      <div className="payment-container">
        {loading && <Loader />}
        {token && <PayPal token={token} onSuccess={this.onSuccess} onError={this.onError} showNotification={this.showNotification} changeComponent={this.props.changeComponent} />}
      </div>
    );
  }
}
