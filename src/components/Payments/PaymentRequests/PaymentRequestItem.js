import React, { Component, PropTypes } from 'react';
import { Avatar, Form } from 'elements';
import classNames from 'classnames';
import moment from 'moment';
import {truncateUserName} from 'utils/helpers';
import {Link} from 'react-router';
import jump from 'jump.js';

class PaymentRequestItem extends Component {
  static propTypes = {
    // info: PropTypes.object,
    status: PropTypes.string,
    is_own: PropTypes.bool,
    info: PropTypes.object,
    // declineRent: PropTypes.func,
    // cancelRent: PropTypes.func,
    // approveRent: PropTypes.func,
    setFlag: PropTypes.func,
    active_request: PropTypes.number,
  };

  static defaultProps = {
    payments: []
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      step_2: false
    };
    this.collapseItem = ::this.collapseItem;
    this.selectClassName = ::this.selectClassName;
    this.selectStatus = ::this.selectStatus;
    this.renderPaymentPre = ::this.renderPaymentPre;
    this.renderPaymentPost = ::this.renderPaymentPost;
  }

  collapseItem(status, id) {
    if (/^expired|pended|declined|rented|approved|canceled|paid$/.test(status)) {
      // this.setState({collapsed: !this.state.collapsed});
      const collapsed_id = this.props.active_request === id ? -1 : id;
      this.props.setFlag('active_request', collapsed_id).then(() => {
        if (collapsed_id !== -1) jump(this._row, {offset: -100, duration: 500});
      });
    }
  }

  selectCollapsed(is_own, status, props) {
    if (is_own) {
      return this.forSeller(status, props);
    }
    return this.forBuyer(status, props);
  }

  selectClassName(status) {
    if (this.props.is_own) {
      switch (status) {
        case 'pended':
          return 'pending';
        case 'canceled':
          return 'declined';
        default:
          return status;
      }
    }
    switch (status) {
      case 'pended':
        return 'pending';
      case 'approved':
        return 'unpaid';
      case 'canceled':
        return 'declined';
      default:
        return status;
    }
  }

  selectStatus(status) {
    if (this.props.is_own) {
      switch (status) {
        case 'pended':
          return 'pending';
        case 'approved':
          return 'unpaid';
        case 'paid':
          return 'approved';
        default:
          return status;
      }
    }
    switch (status) {
      case 'pended':
        return 'pending';
      case 'approved':
        return 'unpaid';
      default:
        return status;
    }
  }

//
// collaps for seller
//
  forSeller(status, props) {
    const {info, approveRent, declineRent, updating, canceling} = props;
    const fee = parseInt(info.amount * info.fee, 10) / 100;
    switch (status) {
      case 'expired': // expired
        return (
          <tr className="table__row table__row--expired-open table__row--open-item">
            <td className="table__cell" />
            <td colSpan="6" className="table__cell table__cell--center">
              <span className="payment-notes payment-notes--expired">The time to respond to this application has expired.</span>
            </td>
          </tr>
        );
      case 'pended': // pending
        return ([
          /*<tr key={0} className="is-active table__row--pending table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--pending">Waiting for approval</span></td></tr>*/
          <tr key={1} className="is-active table__row table__row--pending table__row--details">
            <th />
            <th />
            <th colSpan="5" className="table__header-item">Details</th>
          </tr>,
          <tr key={2} className="is-active table__row table__row--pending table__row--details">
            <td />
            <td />
            <td colSpan="5" className="table__cell table__cell--no-space-t-b">{info.post.title}</td>
          </tr>,
          <tr key={3} className="is-active table__row table__row--pending test">
            <td />
            <td />
            <td />
            <td />
            <td colSpan="3" className="table__cell table__cell--procedure">
              <div className="payments__procedure-title">Total payment to be received</div>
              <div className="payments__procedure-lists table">
                <div className="table__row">
                  <div className="payments__procedure-item">{`Rent for ${info.month_num} month`}</div>
                  <div className="payments__procedure-item">{`$${info.amount}`}</div>
                </div>
                <div className="table__row">
                  <div className="payments__procedure-item">Service fee</div>
                  <div className="payments__procedure-item">{`-$${fee}`}</div>
                </div>
                <div className="table__row">
                  <div className="payments__procedure-item payments__procedure-item--no-border">Total</div>
                  <div className="payments__procedure-item payments__procedure-item--no-border">{`$${info.amount - fee}`}</div>
                </div>
                <div className="table__row  payments__procedure-nav">
                  <div className="payments__procedure-item payments__procedure-item--no-border">
                    <Form.Button
                      className={
                        classNames('form-button--circle form-button--default-dark form-button--payments-procedure', 'form-button--loader', {'form-button--loading': canceling})
                      }
                      type="button"
                      disabled={updating || canceling}
                      onClick={() => declineRent(info.post.id, info.id)}
                    >
                      <span>Decline</span>
                    </Form.Button>
                  </div>
                  <div className="payments__procedure-item payments__procedure-item--no-border">
                    <Form.Button
                      className={
                        classNames('form-button--circle form-button--pink form-button--payments-procedure', 'form-button--loader', {'form-button--loading': updating})
                      }
                      type="button"
                      disabled={updating || canceling}
                      onClick={() => approveRent(info.post.id, info.id)}
                    >
                      <span>Approve</span>
                    </Form.Button>
                  </div>
                </div>
              </div>
            </td>
          </tr>,
          <tr key={4} className="table__row is-active table__row--pending">
            <td colSpan="7" className="table__cell table__cell--no-space-t-b">
              <div className="payments__procedure-info"><span className="payments__procedure-bold">IMPORTANT:</span> Payment will be released to the user 2 days after you check in. Cancellation fee will apply if you  cancel reservation within 14 days of check-in.</div>
            </td>
          </tr>,
        ]);
      case 'canceled': // canceled
        return (
          <tr className="is-active table__row table__row--declined table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--declined">Application has been canceled</span></td></tr>
        );
      case 'declined': // declined
        return ([
          <tr key={1} className="is-active table__row table__row--declined table__row--details">
            <th />
            <th />
            <th colSpan="5" className="table__header-item">Details</th>
          </tr>,
          <tr key={2} className="is-active table__row table__row--declined table__row--details">
            <td />
            <td />
            <td colSpan="5" className="table__cell table__cell--no-space-t-b">{info.post.title}</td>
          </tr>,
          <tr key={3} className="is-active table__row table__row--declined table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--declined">{`You declined ${info.buyer.full_name.split(' ')[0]}’s application. We will notify you when another user applies again.`}</span></td></tr>,
        ]);
      case 'rented': // paid
        return ([
          <tr key={1} className="is-active table__row table__row--paid table__row--details">
            <th />
            <th />
            <th colSpan="5" className="table__header-item">Details</th>
          </tr>,
          <tr key={2} className="is-active table__row table__row--paid table__row--details">
            <td />
            <td />
            <td colSpan="5" className="table__cell table__cell--no-space-t-b">{info.post.title}</td>
          </tr>,
          <tr key={3} className="is-active table__row table__row--paid table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--success"><i className="icon icon--checked-green" />Your payment was successful. If you want to cancel your booking please <Link className="link--underline link--inherit-color" to="/contact_us">contact us</Link>.</span></td></tr>,
        ]);
      case 'approved': // unpaid
        return ([
          <tr key={1} className="is-active table__row table__row--approved table__row--details">
            <th />
            <th />
            <th colSpan="5" className="table__header-item">Details</th>
          </tr>,
          <tr key={2} className="is-active table__row table__row--approved table__row--details">
            <td />
            <td />
            <td colSpan="5" className="table__cell table__cell--no-space-t-b">{info.post.title}</td>
          </tr>,
          <tr key={3} className="is-active table__row table__row--approved table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--success"><i className="icon icon--checked-green" />{`You approved ${info.buyer.full_name.split(' ')[0]}’s application. We will notify you when payment is received.`}</span></td></tr>,
        ]);
      case 'paid': // unpaid
        return ([
          <tr key={0} className="is-active table__row table__row--paid table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--success">Payment was received and will be released after the user checks-in.</span></td></tr>,
        ]);
      default:
        return null;
    }
  }
//
// collaps for buyer
//
  forBuyer(status, props) {
    const { info, cancelRent, payRent, payments, updating, canceling } = props;
    const { step_2 } = this.state;
    const default_payment = payments.find(c => c.default);
    const fee = parseInt(info.amount * info.fee, 10) / 100;
    switch (status) {
      case 'expired': // expired
        return (
          <tr className="table__row table__row--expired-open table__row--open-item">
            <td className="table__cell" />
            <td colSpan="6" className="table__cell table__cell--center">
              <span className="payment-notes payment-notes--expired">The time to respond to this application has expired.</span>
            </td>
          </tr>
        );
      case 'pended': // pending
        return ([
          <tr key={0} className="is-active table__row table__row--pending table__row--open-item">
            <td colSpan="7" className="table__cell table__cell--center">
              <span className="payment-notes payment-notes--pending">Your application is pending for approval, we will notify you when it’s approved.</span>
            </td>
          </tr>,
          //<tr key={1} className="is-active table__row--pending table__row--open-item">
          //  <td colSpan="7" className="table__cell table__cell--center">
          //    <Form.Button
          //      className="form-button--circle form-button--default-dark form-button--payments-procedure"
          //      onClick={() => cancelRent(info.post.id, info.id)}
          //    >
          //      Cancel
          //    </Form.Button>
          //  </td>
          //</tr>,
        ]);
      case 'canceled': // canceled
        return (
          <tr className="is-active table__row table__row--declined table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--declined">Application has been canceled</span></td></tr>
        );
      case 'declined': // declined
        return (
          <tr className="is-active table__row table__row--declined table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--declined">We are sorry. Your application has been declined by the owner.</span></td></tr>
        );
      case 'paid': // paid
        return ([
          <tr key={3} className="is-active table__row table__row--paid table__row--open-item"><td colSpan="7" className="table__cell table__cell--center"><span className="payment-notes payment-notes--success">Your payment was successfull. If you want to cancel your booking please <Link className="link--underline link--inherit-color" to="/contact_us">contact us</Link>.</span></td></tr>,
        ]);
      case 'approved': // unpaid
        return ([
          <tr key={1} className="is-active table__row table__row--unpaid table__row--details">
            <th />
            <th />
            <th colSpan="5" className="table__header-item">Details</th>
          </tr>,
          <tr key={2} className="is-active table__row table__row--unpaid table__row--details">
            <td />
            <td />
            <td colSpan="5" className="table__cell table__cell--no-space-t-b">{info.post.title}</td>
          </tr>,
          <tr key={3} className="is-active table__row table__row--unpaid test">
            <td />
            <td />
            <td />
            <td />
            <td colSpan="3" className="table__cell table__cell--procedure">
              <div className="payments__procedure-title">Proceed to secure payment</div>
              <div className="payments__procedure-lists table">
                {step_2 && default_payment &&
                  <div className="table__row">
                    <div className="payments__procedure-item">
                      {/*<i className="icon icon--master-card" />*/}
                      {this.renderPaymentPre(default_payment.method_type, default_payment.card_type)}
                    </div>
                    <div className="payments__procedure-item">{this.renderPaymentPost(default_payment)}</div>
                  </div>
                }
                <div className="table__row">
                  <div className="payments__procedure-item">{`Rent for ${info.month_num} month`}</div>
                  <div className="payments__procedure-item">{`$ ${info.amount}`}</div>
                </div>
                <div className="table__row">
                  <div className="payments__procedure-item">Service fee</div>
                  <div className="payments__procedure-item">{`$ ${fee}`}</div>
                </div>
                <div className="table__row">
                  <div className="payments__procedure-item payments__procedure-item--no-border">Total</div>
                  <div className="payments__procedure-item payments__procedure-item--no-border">{`$ ${info.amount + fee}`}</div>
                </div>
                <div className="table__row  payments__procedure-nav">
                  <div className="payments__procedure-item payments__procedure-item--no-border">
                    <Form.Button
                      className={
                        classNames('form-button--circle form-button--default-dark form-button--payments-procedure', 'form-button--loader', {'form-button--loading': canceling})
                      }
                      type="button"
                      disabled={updating || canceling}
                      onClick={() => cancelRent(info.post.id, info.id)}
                    >
                      <span>Decline</span>
                    </Form.Button>
                  </div>
                  {(!step_2 || !default_payment) &&
                    <div className="payments__procedure-item payments__procedure-item--no-border">
                      <Link
                        className="form-button form-button--circle form-button--pink form-button--payments-procedure"
                        to="/profile/payments/payment"
                        onClick={(e) => this.secondStep(e, step_2)}
                      >
                        <span>Next</span>
                      </Link>
                    </div>
                  }
                  {step_2 && default_payment &&
                    <div className="payments__procedure-item payments__procedure-item--no-border">
                      <Form.Button
                        className={
                          classNames('form-button--circle form-button--pink form-button--payments-procedure', 'form-button--loader', {'form-button--loading': updating})
                        }
                        type="button"
                        disabled={updating || canceling}
                        onClick={() => payRent(info.post.id, info.id).then(r => {jump('.app'); return r;})}
                      >
                        <span>Rent</span>
                      </Form.Button>
                    </div>
                  }
                </div>
              </div>
            </td>
          </tr>,
          <tr key={4} className="table__row is-active table__row--unpaid">
            <td colSpan="7" className="table__cell table__cell--no-space-t-b">
              <div className="payments__procedure-info"><span className="payments__procedure-bold">IMPORTANT:</span> Payment will be released to the user 2 days after you check in. Cancellation fee will apply if you  cancel reservation within 14 days of check-in.</div>
            </td>
          </tr>,
        ]);
      default:
        return null;
    }
  }

  secondStep(e, step_2) {
    if (!step_2) {
      e.preventDefault();
      this.setState({step_2: true});
    }
  }

  renderPaymentPre(type, card) {
    switch (type) {
      case 'cc':
        return this.renderCardIcon(card);
      case 'paypal':
        return <i className="icon icon--paypal" />;
      case 'ach':
        return 'ACH deposit';
      default:
        return type;
    }
  }

  renderPaymentPost(payment) {
    switch (payment.method_type) {
      case 'cc':
        return `XX${payment.last_4}`;
      case 'paypal':
        return '';
      case 'ach':
        return `Ending ${payment.last_4}`;
      default:
        return '';
    }
  }

  renderCardIcon(type) {
    switch (type) {
      case 'MasterCard':
        return <i className="icon icon--master-card" />;
      case 'Visa':
        return <i className="icon icon--visa" />;
      case 'American Express':
        return <i className="icon icon--american-express" />;
      case 'Discover':
        return <i className="icon icon--discover" />;
      default:
        return <span>{type}</span>;
    }
  }

  render() {
    const {status, is_own, info, active_request} = this.props;
    const normalized_status = this.selectStatus(status);
    const normalized_class = this.selectClassName(status);
    const collapsed = active_request === info.id;
    return (
      <tbody className="table__body" ref={n => this._row = n}>
        <tr
          onClick={() => this.collapseItem(status, info.id)}
          className={
            classNames({'is-active': collapsed},
              'table__row table__row--flex',
              {[`table__row--${normalized_class}`]: !!normalized_class}
            )}
        >
          <td className="table__cell table__cell--first table__cell--no-space">
            <div className="payments__avatar">
              <Link to={`/profile/${info.buyer.id}`} onClick={e => {e.stopPropagation();}} className="avatar-wrapper avatar-wrapper--md-large">
                <Avatar img={info.buyer.avatar} />
              </Link>
              <div className="payments__user-name">{truncateUserName(info.buyer.full_name, true)}</div>
            </div>
          </td>
          <td className="table__cell table__cell--second">
            <span className="table__mob-ttl">ID #</span>
            <span>{info.bid}</span>
          </td>
          <td className="table__cell table__cell--third">
            <span className="table__mob-ttl">Applied On</span>
            <span>{moment(info.created_at).format('DD MMMM YYYY')}</span>
          </td>
          <td className="table__cell table__cell--fourth">
            <span className="table__mob-ttl">Rent From</span>
            <span>{moment(info.checkin_date).format('DD MMMM YYYY')}</span>
          </td>
          <td className="table__cell table__cell--fifth">
            <span className="table__mob-ttl">Period</span>
            <span>{info.month_num === 1 ? `${info.month_num} Month` : `${info.month_num} Months`}</span>
          </td>
          <td className="table__cell table__cell--sixth">
            <span className="table__mob-ttl">Amount</span>
            <span>{`$${info.amount}`}</span>
          </td>
          <td className="table__cell table__cell--seven">
            <span className="table__mob-ttl">Status</span>
            <span className={classNames('payment-status', {[`payment-status--${normalized_class}`]: !!normalized_class})}>{normalized_status}</span>
          </td>
        </tr>
        {collapsed ? this.selectCollapsed(is_own, status, this.props) : null}
      </tbody>
    );
  }
}

export default PaymentRequestItem;
