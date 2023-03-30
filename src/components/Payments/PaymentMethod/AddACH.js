import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { PlaidACH } from 'components';
import { createStripePayment } from 'redux/modules/payments';
import { showNotification } from 'redux/modules/notifications';


@connect(st => ({
  // loading: st.payments.braintree_loading,
  // token: st.payments.braintree_token,
  address: st.payments.address,
}), {
  // loadBraintreeToken,
  // createBraintreePayment,
  createStripePayment,
  showNotification,
})
export default class AddACH extends Component {
  static propTypes = {
    // loadBraintreeToken: PropTypes.func,
    changeComponent: PropTypes.func,
    createStripePayment: PropTypes.func,
    showNotification: PropTypes.func,
    address: PropTypes.object,
  };

  constructor() {
    super();
    this.onSuccess = ::this.onSuccess;
    this.onError = ::this.onError;
    this.showNotification = ::this.showNotification;
  }

  // componentDidMount() {
  //   this.props.loadBraintreeToken().catch((err) => {
  //     console.error(err);
  //     this.props.showNotification('payment_err', {text: 'Payment error', type: 'error'});
  //     this.props.changeComponent('');
  //   });
  // }

  onSuccess(data) {
    this.props.createStripePayment(data).then(() => {
      this.props.showNotification('payment_added', {text: 'Payment method has been successfully added', type: 'success'});
      this.props.changeComponent(null);
    }, () => {
      this.props.showNotification('payment_err', {text: 'Payment error', type: 'error'});
      this.props.changeComponent(null);
    });
  }

  onError() {
    // this.props.showNotification('payment_err', {text: message, type: 'error'});
    // this.props.changeComponent(null);
  }

  showNotification(message) {
    this.props.showNotification('payment_err', {text: message, type: 'error'});
  }

  render() {
    const { address } = this.props;
    return (
      <div className="payment-container">
        <PlaidACH address={address} changeComponent={this.props.changeComponent} onSuccess={this.onSuccess} onError={this.onError} showNotification={this.showNotification} />
      </div>
    );
  }
}
