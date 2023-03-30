import React, { Component, PropTypes } from 'react';
import AddPayment from './PaymentMethod/AddPayments';
import AddCC from './PaymentMethod/AddCC';
import AddPP from './PaymentMethod/AddPP';
import AddACH from './PaymentMethod/AddACH';
import AddAddress from './PaymentMethod/AddAddress';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import { Loader } from 'elements';
import { selectDefaultPayment, saveAddress, clearAddress, removePayment } from 'redux/modules/payments';
import moment from 'moment';
import DropdownPaymentSetting from './DropdownPaymentSetting';
import { Modal } from 'elements';
import { RemoveCard } from 'components';

@connect(st => ({
  location: st.routing.locationBeforeTransitions,
  payment_creating: st.payments.payment_creating,
  address: st.payments.address,
}), {
  push,
  selectDefaultPayment,
  saveAddress,
  clearAddress,
  removePayment
})
export default class PaymentMethods extends Component {
  static propTypes = {
    location: PropTypes.object,
    push: PropTypes.func,
    selectDefaultPayment: PropTypes.func,
    removePayment: PropTypes.func,
    saveAddress: PropTypes.func,
    clearAddress: PropTypes.func,
    payments: PropTypes.array,
    address: PropTypes.object,
    // payments_loading: PropTypes.bool,
    payment_creating: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      show_modal: false,
      show_confirm: false,
    };
    this.changeComponent = ::this.changeComponent;
    this.selectCard = ::this.selectCard;
    this.removeCard = ::this.removeCard;
    this.showModal = ::this.showModal;
    this.hideModal = ::this.hideModal;
    this.showConfirm = ::this.showConfirm;
    this.hideConfirm = ::this.hideConfirm;
  }

  componentWillMount() {
    const { location: {pathname, query}, address } = this.props;
    if (query.stage && !address) {
      this.props.push({pathname});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.stage && !nextProps.location.query.stage) {
      this.props.clearAddress();
    }
  }

  changeComponent(name) {
    const { location: {pathname, query}, address } = this.props;
    if (address || !name) {
      const queryObject = {...query, stage: name};
      if (!name) delete queryObject.stage;
      this.props.push({pathname, query: queryObject});
      return true;
    }
    this.showModal();
    return true;
  }

  showModal() {
    this.setState({
      show_modal: true,
    });
  }

  hideModal() {
    this.setState({
      show_modal: false,
    });
  }

  showConfirm(token) {
    this.setState({
      show_confirm: true,
      token
    });
  }

  hideConfirm() {
    this.setState({
      show_confirm: false,
      token: null,
    });
  }

  selectCard(token) {
    this.props.selectDefaultPayment({token});
  }

  removeCard(token) {
    this.props.removePayment({token}).then(r => {
      this.hideConfirm();
      return Promise.resolve(r);
    });
  }

  switchMethod(type) {
    switch (type) {
      case 'cc':
        return 'Credit Card';
      case 'paypal':
        return 'Paypal';
      case 'ach':
        return 'Direct Deposit (ACH)';
      default:
        return type;
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

  renderMethodType(type, c) {
    switch (type) {
      case 'cc':
        return <span className="details-wrapper">{this.renderCardIcon(c.card_type)}&nbsp;&nbsp;<span className="payments-ending">{` ending ${c.last_4}`}</span> </span>;
      case 'paypal':
        return c.email;
      case 'ach':
        return `ending ${c.last_4}`;
      default:
        return <span>{type}</span>;
    }
  }

  render() {
    const {location: {query}, payments, /*payments_loading,*/ payment_creating} = this.props;
    switch (query.stage) {
      case 'add_payment':
        return (<AddPayment changeComponent={this.changeComponent} />);
      case 'credit_card':
        return (<AddCC changeComponent={this.changeComponent} />);
      case 'paypal':
        return (<AddPP changeComponent={this.changeComponent} />);
      case 'ach':
        return (<AddACH changeComponent={this.changeComponent} />);
      default:
        return (
          <div style={{position: 'relative'}}>
            {payments.length <= 0 &&
              <div className="alert alert-dismissible alert--danger payments__notification">
                <span className="alert__icon">
                  <i className="icon icon--error-lg" />
                </span>
                <span className="alert__text">Add a payment method</span>
              </div>
            }
            <div className="payments__preview payments__preview--payment-method">
              <table className="table-payments table table-responsive table__payment-method table__payment-method--cards-list">
                <thead className="table__header">
                  <tr className="table__row table__row--header">
                    <th className="table__header-item">Method</th>
                    <th className="table__header-item">Status</th>
                    <th className="table__header-item">Data Added</th>
                    <th className="table__header-item">Details</th>
                    <th className="table__header-item" />
                  </tr>
                </thead>
                <tbody className="table__body">
                  {payments.map(c =>
                    <tr className="table__row" key={c.id}>
                      <td className="table__cell table__cell--card-type">{this.switchMethod(c.method_type)}</td>
                      <td className={'table__cell table__cell--status' + (c.default ? ' table__cell--default' : '')}>{c.default ? 'Default' : ''}</td>
                      <td className="table__cell table__cell--modified"><span className="table__cell-mob-added">Added on </span>{moment(c.created_at).format('DD MMMM, YYYY')}</td>
                      <td className="table__cell table__cell--details">{this.renderMethodType(c.method_type, c)}</td>
                      <td className="table__cell table__cell--settings"><DropdownPaymentSetting is_default={c.default} setAsDefault={() => this.selectCard(c.token)} removeCard={() => this.showConfirm(c.token)} /></td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                className="form-button form-button--user-action form-button--circle form-button--pink form-button--capitalize form-button--position-right"
                type="button"
                onClick={() => this.changeComponent('add_payment')}
              >
                <span>{'Add Payment'}</span>
              </button>
            </div>
            <Modal
              className="modal--payments"
              opened={this.state.show_modal}
              handleClose={this.hideModal}
              innerButtonClose
            >
              <AddAddress saveAddress={this.props.saveAddress} changeComponent={() => this.changeComponent('add_payment')} />
            </Modal>
            <Modal
              className="modal--save-block"
              handleClose={this.hideConfirm}
              opened={this.state.show_confirm}
            >
              <RemoveCard onConfirm={() => this.removeCard(this.state.token)} onCancel={this.hideConfirm} loading={payment_creating} />
            </Modal>
          </div>
        );
    }
  }
}
