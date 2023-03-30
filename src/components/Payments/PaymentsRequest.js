import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {/* loadRequests, */approveRent, declineRent, cancelRent, payRent } from 'redux/modules/rent';
import { setFlag } from 'redux/modules/flags';
import PaymentRequestItem from './PaymentRequests/PaymentRequestItem';

@connect(st => ({
  // loading: st.rent.req_loading,
  user: st.auth.user,
  requests: st.rent.requests,
  payments: st.payments.payment_methods,
  updating: st.rent.req_updating,
  canceling: st.rent.req_canceling,
  active_request: st.flags.active_request,
}), {
  // loadRequests,
  declineRent,
  cancelRent,
  approveRent,
  payRent,
  setFlag,
})

export default class PaymentsRequest extends Component {
  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    requests: PropTypes.any,
    // loadRequests: PropTypes.func,
    payments: PropTypes.array,
    setFlag: PropTypes.func,
    // active_request: PropTypes.number,
  }

  componentWillUnmount() {
    this.props.setFlag('active_request', -1);
  }

  render() {
    const {requests, user, ...rest} = this.props;
    return (
      <div style={{position: 'relative'}}>
        <table className="table table-responsive table-payments table-payments--users payments__table">
          <thead className="table__header">
            <tr className="table__row table__row--header">
              <th className="table__header-item">Applicant</th>
              <th className="table__header-item">ID#</th>
              <th className="table__header-item">Applied on</th>
              <th className="table__header-item">Rent from</th>
              <th className="table__header-item">Period</th>
              <th className="table__header-item">Amount</th>
              <th className="table__header-item">Status</th>
            </tr>
          </thead>
          {/*requests && requests.seller && requests.seller.bookings.length > 0 &&
            <tbody className="table-payments__who">
              <tr>
                <td colSpan={7}>
                  Seller
                </td>
              </tr>
            </tbody>*/
          }
          {requests && requests && requests.bookings.map(c =>
            <PaymentRequestItem {...rest} key={c.id} status={c.status} info={c} is_own={c.seller.id === user.id} />
          )}
          {/*requests && requests.buyer && requests.buyer.bookings.length > 0 &&
            <tbody className="table-payments__who">
              <tr>
                <td colSpan={7}>
                  Buyer
                </td>
              </tr>
            </tbody>*/
          }
          {/*requests && requests && requests.bookings.map(c =>
            <PaymentRequestItem {...rest} key={c.id} status={c.status} info={c} />
          )*/}

          {/*

          <tbody>
            <tr>
              <td colSpan={7}>
                Seller
              </td>
            </tr>
          </tbody>
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'expired'} info={requests.seller.bookings[0]} is_own />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'pended'} info={requests.seller.bookings[0]} is_own />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'declined'} info={requests.seller.bookings[0]} is_own />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'canceled'} info={requests.seller.bookings[0]} is_own />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'paid'} info={requests.seller.bookings[0]} is_own />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'approved'} info={requests.seller.bookings[0]} is_own />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'rented'} info={requests.seller.bookings[0]} is_own />}
          <tbody>
            <tr>
              <td colSpan={7}>
                Buyer
              </td>
            </tr>
          </tbody>
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'expired'} info={requests.seller.bookings[0]} />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'pended'} info={requests.seller.bookings[0]} />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'canceled'} info={requests.seller.bookings[0]} />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'paid'} info={requests.seller.bookings[0]} />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'approved'} info={requests.seller.bookings[0]} />}
          {requests && requests.seller.bookings && requests.seller.bookings[0] && <PaymentRequestItem {...rest} status={'rented'} info={requests.seller.bookings[0]} />}

          */}
        </table>
        {/*<table className="table table-payments table-payments--users payments__table">
          <thead className="table__header">
            <tr className="table__row">
              <th className="table__header-item">User</th>
              <th className="table__header-item">ID#</th>
              <th className="table__header-item">Applied on</th>
              <th className="table__header-item">Rent from</th>
              <th className="table__header-item">Period</th>
              <th className="table__header-item">Amount</th>
              <th className="table__header-item">Status</th>
            </tr>
          </thead>
          <tbody className="table__body table__body--unpaid">
            <tr className="table__row table__row--unpaid">
              <td className="table__cell table__cell--no-space">
                <div className="payments__avatar">
                  <span className="avatar-wrapper avatar-wrapper--md-large">
                    <Avatar />
                  </span>
                  <div className="payments__user-name">Carol</div>
                </div>
              </td>
              <td className="table__cell">234897234</td>
              <td className="table__cell">13 January 2017</td>
              <td className="table__cell">13 January 2016</td>
              <td className="table__cell">3 Months</td>
              <td className="table__cell">$1,900</td>
              <td className="table__cell"><span className="payment-status payment-status--unpaid"><i className="icon icon--error-xs" />Unpaid</span></td>
            </tr>
            <tr className="table__row">
              <th />
              <th />
              <th colSpan="5" className="table__header-item">Details</th>
            </tr>
            <tr className="table__row">
              <td />
              <td />
              <td colSpan="5" className="table__cell table__cell--no-space-t-b">One bed room in Beacon Hill</td>
            </tr>
            <tr className="table__row">
              <td />
              <td />
              <td />
              <td />
              <td colSpan="3" className="table__cell table__cell--procedure">
                <div className="payments__procedure-title">Proceed to secure payment</div>
                <div className="payments__procedure-lists table">
                  <div className="table__row">
                    <div className="payments__procedure-item"><i className="icon icon--master-card" /></div>
                    <div className="payments__procedure-item">XX7658</div>
                  </div>
                  <div className="table__row">
                    <div className="payments__procedure-item">Rent for 1 month</div>
                    <div className="payments__procedure-item">$ 1,000</div>
                  </div>
                  <div className="table__row">
                    <div className="payments__procedure-item">Service fee</div>
                    <div className="payments__procedure-item">$ 50</div>
                  </div>
                  <div className="table__row">
                    <div className="payments__procedure-item payments__procedure-item--no-border">Total</div>
                    <div className="payments__procedure-item payments__procedure-item--no-border">$ 1,050</div>
                  </div>
                  <div className="table__row  payments__procedure-nav">
                    <div className="payments__procedure-item payments__procedure-item--no-border">
                      <Form.Button
                        className="form-button--circle form-button--default-dark form-button--payments-procedure"
                        type="button"
                      >
                        <span>Decline</span>
                      </Form.Button>
                    </div>
                    <div className="payments__procedure-item payments__procedure-item--no-border">
                      <Form.Button
                        className="form-button--circle form-button--pink form-button--payments-procedure"
                        type="button"
                      >
                        <span>Rent</span>
                      </Form.Button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="payments__procedure-info payments__procedure-info--unpaid">IMPORTANT: Payment will be released to the user 2 days after you check in. Cancellation fee will apply if you  cancel reservation within 14 days of check-in.</div>*/}
      </div>
    );
  }

}
