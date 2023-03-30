import React, { Component, PropTypes } from 'react';
import AddPayout from './PayoutMethod/AddPayout';
import AddPP from './PayoutMethod/AddPP';
import AddACH from './PayoutMethod/AddACH';
import AddAddress from './PaymentMethod/AddAddress';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import { Loader } from 'elements';
import { saveAddress, clearAddress, selectDefaultPayout, removePayout } from 'redux/modules/payments';
import moment from 'moment';
import DropdownPaymentSetting from './DropdownPaymentSetting';
import { Modal } from 'elements';
import { RemoveCard } from 'components';

@connect(st => ({
  location: st.routing.locationBeforeTransitions,
  payout_loading: st.payments.payout_loading,
  address: st.payments.address,
}), {
  push,
  selectDefaultPayout,
  removePayout,
  saveAddress,
  clearAddress
})
export default class PayoutMethods extends Component {
  static propTypes = {
    location: PropTypes.object,
    push: PropTypes.func,
    selectDefaultPayout: PropTypes.func,
    removePayout: PropTypes.func,
    saveAddress: PropTypes.func,
    clearAddress: PropTypes.func,
    payouts: PropTypes.array,
    address: PropTypes.object,
    // payments_loading: PropTypes.bool,
    payout_loading: PropTypes.bool,
  }

  constructor() {
    super();
    this.state = {
      show_modal: false
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
  /*eslint-disable*/
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
  /*eslint-enable*/
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

  showConfirm(id) {
    this.setState({
      show_confirm: true,
      id
    });
  }

  hideConfirm() {
    this.setState({
      show_confirm: false,
      id: null,
    });
  }

  removeCard(id) {
    this.props.removePayout(id).then(r => {
      this.hideConfirm();
      return Promise.resolve(r);
    });
  }

  selectCard(id) {
    this.props.selectDefaultPayout(id);
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
        return <span>{this.renderCardIcon(c.card_type)}&nbsp;&nbsp;{` ending ${c.last_4}`}</span>;
      case 'paypal':
        return c.email;
      case 'ach':
        return `ending ${c.last_3}`;
      default:
        return <span>{type}</span>;
    }
  }

  render() {
    const {location: {query}, payouts, payout_loading} = this.props;
    switch (query.stage) {
      case 'add_method':
        return (<AddPayout changeComponent={this.changeComponent} />);
      case 'paypal':
        return (<AddPP changeComponent={this.changeComponent} />);
      case 'ach':
        return (<AddACH changeComponent={this.changeComponent} />);
      default:
        return (
          <div style={{position: 'relative'}}>
            {payouts.length <= 0 &&
              <div className="alert alert-dismissible alert--danger payments__notification">
                <span className="alert__icon">
                  <i className="icon icon--error-lg" />
                </span>
                <span className="alert__text">Add a payout method</span>
              </div>
            }
            <div className="payments__preview">
              <table className="table table__payment-method table__payment-method--cards-list payments__table">
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
                  {payouts.map(c =>
                    <tr className="table__row" key={c.id}>
                      <td className="table__cell table__cell--card-type">{this.switchMethod(c.method_type)}</td>
                      <td className={'table__cell table__cell--status' + (c.default ? ' table__cell--default' : '')}>{c.default ? 'Default' : ''}</td>
                      <td className="table__cell table__cell--modified">{moment(c.created_at).format('DD MMMM, YYYY')}</td>
                      <td className="table__cell table__cell--details">{this.renderMethodType(c.method_type, c)}</td>
                      <td className="table__cell table__cell--settings"><DropdownPaymentSetting is_default={c.default} setAsDefault={() => this.selectCard(c.id)} removeCard={() => this.showConfirm(c.id)} /></td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                className="form-button form-button--user-action form-button--circle form-button--pink form-button--capitalize form-button--position-right"
                type="button"
                onClick={() => this.changeComponent('add_method')}
              >
                <span>{'Add Payout'}</span>
              </button>
            </div>
            <Modal
              className="modal--payments"
              opened={this.state.show_modal}
              handleClose={this.hideModal}
              innerButtonClose
            >
              <AddAddress saveAddress={this.props.saveAddress} changeComponent={() => this.changeComponent('add_method')} title="Add payout method" />
            </Modal>
            <Modal
              className="modal--save-block"
              handleClose={this.hideConfirm}
              opened={this.state.show_confirm}
            >
              <RemoveCard onConfirm={() => this.removeCard(this.state.id)} onCancel={this.hideConfirm} loading={payout_loading} type="payout" />
            </Modal>
          </div>
        );
    }
  }
}
