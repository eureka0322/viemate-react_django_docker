import React, { Component, PropTypes } from 'react';
import {} from './ConfirmRent.scss';
import { Form } from 'elements';
import { reduxForm, Field, SubmissionError, getFormValues } from 'redux-form';
import moment from 'moment';
import {connect} from 'react-redux';
import {applyForRent} from 'redux/modules/rent';
import {showNotification} from 'redux/modules/notifications';

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

const biggerDate = (date) => {
  if (parseFloat(moment(date).format('x')) < parseFloat(moment().format('x'))) {
    return moment().format('YYYY-MM-DD');
  }
  return date;
};

@connect((st) => ({
  form_values: getFormValues('form-confirm')(st) || {}
}), {
  applyForRent,
  showNotification
})
@reduxForm({
  form: 'form-confirm',
})
export default class ConfirmRent extends Component {
  static propTypes = {
    initialize: PropTypes.func,
    showModal: PropTypes.func,
    closeModal: PropTypes.func,
    applyForRent: PropTypes.func,
    product: PropTypes.object,
    price: PropTypes.number,
    handleSubmit: PropTypes.func,
    error: PropTypes.string,
    form_values: PropTypes.object,
    showNotification: PropTypes.func,
  };

  static defaultProps = {
    price: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      month: 1,
      price: props.price,
      fee: parseInt(props.price * 5, 10) / 100,
    };
    this.handleApply = ::this.handleApply;
    this.numberOfMonths = ::this.numberOfMonths;
  }

  componentDidMount() {
    const {product: {start_date}} = this.props;
    const date = biggerDate(start_date);
    if (date) {
      this.props.initialize({rent_for: 1, check_in_date: moment(date, 'YYYY-MM-DD')});
    } else {
      this.props.initialize({rent_for: 1});
    }
  }

  numberOfMonths(val) {
    this.setState({month: val, price: this.props.price * val, fee: parseInt(this.props.price * val * 5, 10) / 100 });
  }

  handleApply(data) {
    return this.props.applyForRent({checkin_date: moment(data.check_in_date).format('DD/MM/YYYY'), month_num: data.rent_for}, this.props.product.id).then((r) => {
      this.props.closeModal('rent_modal_is_opened');
      this.props.showModal('success_modal_is_opened');
      return r;
    }).catch((err) => {
      if (err.body.errors && err.body.errors.full_messages) {
        const errors_keys = Object.keys(err.body.errors);
        let errors = {};
        errors_keys.forEach(c => {
          errors = { ...errors, [c]: err.body.errors[c][0] };
        });
        throw new SubmissionError({ ...errors, _error: err.body.errors.full_messages[0] });
      } else if (err.body.errors && err.body.errors.buyer_id) {
        this.props.showNotification('apply_error', {text: err.body.errors.buyer_id[0], type: 'error'});
        throw new SubmissionError({ _error: (err.body.errors.buyer_id[0]) });
      } else {
        throw new SubmissionError({ _error: (err.body.error || err.body.errors[0] || '') });
      }
    });
  }

  render() {
    const {product: {start_date, end_date}, error, handleSubmit, form_values: {check_in_date, rent_for}} = this.props;
    const {month, price, fee} = this.state;
    return (
      <div className="confirm-form">
         <div className="confirm-form__container confirm-form__container--bg-white">
          <div className="confirm-form__title">Luxury Rental in Boston..</div>
          <div className="confirm-form__section">
            <div className="confirm-form__group--half-w">
              <Form.DateSinglePicker
                name="check_in_date"
                numberOfMonths={1}
                id="start_date"
                dateLabel="Rent from"
                isDayBlocked={(param) => !moment(param).isBetween(start_date, moment(end_date).subtract(29, 'days'))}
              />
            </div>
            <div className="confirm-form__group--half-w">
              {check_in_date &&
                <div>
                  <div className="date-range-picker__labels"><div className="date-range-picker__label-wrap date-range-picker__label-wrap--start"><span className="date-range-picker__label">Rent to</span></div></div>
                  <div className="confirm-form__rent_to">{moment(check_in_date).add({days: (30 * rent_for)}).format('DD.MM.YYYY')}</div>
                </div>
              }
            </div>
          </div>
          <div className="confirm-form__section confirm-form__section--select">
            <div className="confirm-form__section--select-period">
              <div className="confirm-form__label confirm-form__label--select-label">For</div>
              <div className="select-custom select-custom--terms">
                <Field
                  name="rent_for"
                  list={[{ value: 1, label: '1 Month'}, { value: 2, label: '2 Month' }]}
                  type="select"
                  component={renderSelectbox}
                  defaultLabel="Select a role"
                  label="For"
                  cbFunction={this.numberOfMonths}
                />
              </div>
            </div>
            <div className="confirm-form__section--text">Minimum 1 month is required.</div>
          </div>
          <div className="table">
            <div className="table__row">
              <div className="table__cell">Rent for <span>{`${month} month`}</span></div>
              <div className="table__cell text-right">{`$${price}`}</div>
            </div>
            <div className="table__row">
              <div className="table__cell">Service fee</div>
              <div className="table__cell text-right">{`$${fee}`}</div>
            </div>
            <div className="table__row">
              <div className="table__cell">Total</div>
              <div className="table__cell text-right">{`$${price + fee}`}</div>
            </div>
          </div>
          <Form.Button
            className="form-button--user-action form-button--circle form-button--pink form-button--full-width"
            type="submit"
            onClick={handleSubmit(this.handleApply)}
          >
            <span>Apply to rent</span>
          </Form.Button>
        </div>
        {error && <Form.Error message={error} />}
        { /* <div className="confirm-form__container confirm-form__container--bg-green text-center">
          <div className="confirm-form__info-text">Congrats!</div>
          <i className="icon icon--success-lg"/>
          <p className="confirm-form__success-text">Your application has been sent.</p>
          <p className="confirm-form__success-text">We will get back to you soon :)</p>
        </div> */}
        <div className="panel-info">
          <i className="icon icon--worry" />
          <span>Do not wire money, send your ID or share your private information. Please report any user who asks for it.</span>
        </div>

      </div>

    );
  }

}
