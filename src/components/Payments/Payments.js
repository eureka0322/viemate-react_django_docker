import React, { Component, PropTypes } from 'react';
import PayoutMethod from './PayoutMethod';
import PaymentMethod from './PaymentMethod';
import TransactionsHistory from './TransactionsHistory';
import PaymentsRequest from './PaymentsRequest';
import PaymentHeader from './PaymentHeader';
import PaymentsLinksMobile from './PaymentsLinksMobile';
// import UserPaymentsRequest from './UserPaymentsRequest';
import {} from './Payments.scss';
import payment_tabs from 'utils/payment_tabs';
import { connect } from 'react-redux';
import { loadPayments } from 'redux/modules/payments';
import { loadRequests } from 'redux/modules/rent';

// import { Form } from 'elements';
// import { reduxForm, Field } from 'redux-form';

// const renderRadio = field =>
//   <Form.Radio
//     field={field}
//     {...field}
//   />;

// @reduxForm({
//   form: 'form-manage-post',
//   destroyOnUnmount: false,
// })

@connect(st => ({
  user: st.auth.user,
  payments: st.payments.payment_methods,
  payouts: st.payments.payout_methods,
  payments_loading: st.payments.payments_loading,
  transactions: st.rent.transactions,
  transactions_loading: st.payments.transactions_loading,
  screen_type: st.screen_type.screen_type,
  requests: st.rent.requests,
}), {
  loadRequests,
  loadPayments
})
export default class Payments extends Component {
  static propTypes = {
    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    // error: PropTypes.string,
    // errors: PropTypes.object,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    // pristine: PropTypes.bool.isRequired,
    // reset: PropTypes.func.isRequired,
    // submitting: PropTypes.bool.isRequired,
    // valid: PropTypes.bool.isRequired
    user: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    loadRequests: PropTypes.func,
    payments: PropTypes.array,
    payouts: PropTypes.array,
    screen_type: PropTypes.string,
    requests: PropTypes.object,
  };

  constructor() {
    super();
    this.renderComponent = ::this.renderComponent;
  }

  // componentDidMount() {
  //   this.props.loadPayments();
  // }

  componentDidMount() {
    this.props.loadRequests();
  }

  // submit(data) {
  //   console.log(data);
  // }

  renderComponent(tab, isMobile, warnings) {
    switch (tab) {
      case 'requests':
        return (<PaymentsRequest {...this.props} />);
      case 'payment':
        return (<PaymentMethod {...this.props} />);
      case 'payout':
        return (<PayoutMethod {...this.props} />);
      case 'transactions':
        return (<TransactionsHistory {...this.props} />);
      default:
        if (isMobile) return <PaymentsLinksMobile links={payment_tabs} warnings={warnings} />;
        return <PaymentsRequest />;
    }
  }

  render() {
    const { params, payments, screen_type, location, requests, payouts, user } = this.props;
    const payouts_warning = requests && (!payouts.find(c => c.default) && !!requests.bookings.find(c => (c.seller.id === user.id && c.status === 'paid')));
    const warnings = [payments.length > 0 ? '' : 'payment', payouts_warning ? 'payout' : ''];

    return (
      <div>
        <PaymentHeader tabs={payment_tabs} current={params.tab} warnings={warnings} screen_type={screen_type} location={location} />
        {this.renderComponent(params.tab, screen_type === 'mobile', warnings)}
      </div>
    );
  }

}
