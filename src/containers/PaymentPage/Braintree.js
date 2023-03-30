import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { connect } from 'react-redux';
import { setBodyClassname } from 'utils/helpers';
import { CreditCard } from 'components';
import { loadBraintreeToken } from 'redux/modules/payments';

@connect(st => ({
  // loading: st.payments.braintree_loading,
  token: st.payments.braintree_token,
}), {
  loadBraintreeToken
})
export default class PaymentBraintree extends Component {
  static propTypes = {
    token: PropTypes.string,
    loadBraintreeToken: PropTypes.func,
  }

  componentDidMount() {
    setBodyClassname('body-payment_page');
    this.props.loadBraintreeToken();
  }

  render() {
    const {token} = this.props;
    // console.log(token);
    return (
      <div className="payment-container">
        <Helmet {...config.app.head} />
        {token && <CreditCard token={token} />}
      </div>
    );
  }
}
