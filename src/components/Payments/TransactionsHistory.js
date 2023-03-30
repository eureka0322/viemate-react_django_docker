import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class TransactionsHistory extends Component {
  static propTypes = {
    transactions: PropTypes.array,
    user: PropTypes.object,
    loadRequests: PropTypes.func,
  };

  componentDidMount() {
    this.props.loadRequests();
  }

  // transactionType(type) {
  //   switch (type) {
  //     case 'credit_card':
  //       return 'Card transactions';
  //     default:
  //       return '';
  //   }
  // }

  transactionStatus(buyer, paid_out_at) {
    if (buyer || paid_out_at) {
      return 'paid';
    }
    return 'pending';
  }

  calculateAmount(item, user) {
    if (item.buyer.id === user.id) {
      const amount = item.amount + (parseInt(item.amount * item.fee, 10) / 100);
      return `$${amount}`;
    }
    const amount = item.amount - (parseInt(item.amount * item.fee, 10) / 100);
    return `$${amount}`;
  }

  transactionType(item, user) {
    if (item.buyer.id === user.id) {
      return 'Payment';
    }
    return 'Payout';
  }

  render() {
    const {transactions, user} = this.props;

    return (
      <div>
        <div className="table table-responsive payments__table table--payment-history">
          <div className="table__header">
            <div className="table__row">
              <div className="table__header-item table__cell">Paid on</div>
              <div className="table__header-item table__cell">Amount</div>
              <div className="table__header-item table__cell">Method</div>
              <div className="table__header-item table__cell">Status</div>
              <div className="table__header-item table__cell">Transaction ID</div>
            </div>
          </div>
          <div className="table__body">
            {!!transactions && !!transactions[0] && transactions.map(c =>
              <div key={c.id} className="table__row">
                <div className="table__cell">
                  {(c.paid_out_at || c.paid_on_at) ? moment(c.paid_out_at || c.paid_on_at).format('DD MMMM YYYY') : '-'}
                </div>
                <div className="table__cell">
                  {this.calculateAmount(c, user)}
                </div>
                <div className="table__cell">
                  {this.transactionType(c, user)}
                </div>
                <div className="table__cell table__cell--no-space">
                  <span className={`payment-status payment-status--${this.transactionStatus(user.id === c.buyer.id, c.paid_out_at)}`}>
                    {/*<i className={`icon icon--${this.transactionStatus(user.id === c.buyer.id)}`} />*/}
                    <span className="payment-status__title">{this.transactionStatus(user.id === c.buyer.id, c.paid_out_at)}</span>
                  </span>
                </div>
                <div className="table__cell">
                 {c.transaction_id}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
