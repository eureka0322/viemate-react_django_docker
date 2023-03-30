import React, { Component } from 'react';
import {} from './Payments.scss';
import { Avatar, Form } from 'elements';
import { reduxForm, Field } from 'redux-form';

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

@reduxForm({
  form: 'form-payment'
  // validate: PostFormValidation,
  // destroyOnUnmount: false,
  // enableReinitialize: true,
  // onSubmitFail: (errors) => {
  //   // header height 72px + extraheight === 92px
  //   scrollToFirstError(errors, 92);
  // }
})

export default class UserPaymentsRequest extends Component {
  render() {

    return (
      <div>
        <div className="table table--bg-grey payments__table payments__table--users">
          <div className="table__header">
            <div className="table__row">
              <div className="table__header-item table__cell">User</div>
              <div className="table__header-item table__cell">Type</div>
              <div className="table__header-item table__cell">From</div>
              <div className="table__header-item table__cell">Period</div>
              <div className="table__header-item table__cell">Amount</div>
              <div className="table__header-item table__cell">Status</div>
            </div>
          </div>
          <div className="table__body">
            <div className="table__row">
              <div className="table__cell table__cell--no-space">
                <Avatar className="avatar--sm-m" />
                <div className="payments__user-name">Carol</div>
              </div>
              <div className="table__cell">Wanted</div>
              <div className="table__cell">13 January 2016</div>
              <div className="table__cell">1 Month</div>
              <div className="table__cell">$1,900</div>
              <div className="table__cell"><span className="payment-status payment-status--check">Pending</span></div>
            </div>
          </div>
          <div className="table__header">
            <div className="table__row">
              <div className="table__header-item table__cell" />
              <div className="table__header-item table__cell">Details</div>
              <div className="table__header-item table__cell">To</div>
            </div>
          </div>
          <div className="table__body table__body--position-top">
            <div className="table__row">
              <div className="table__cell" />
              <div className="table__cell">
                <span className="user-info">Victor Erixon,</span>
                <span className="user-info">New York, 02134 US</span>
              </div>
              <div className="table__cell">13 January 2016</div>
            </div>
          </div>
        </div>
        <div className="payments__details">
            <div className="payments__select-time">
              <div className="select-custom select-custom--full-width select-custom--lg-h">
                  <Field
                    // disabled={submitting}
                    name="month"
                    list={[{ value: 1, label: '1 Month', selected: true }, { value: 0, label: '2 Month' }]}
                    type="checkbox"
                    component={renderSelectbox}
                    defaultLabel="1 Month"
                  />
              </div>
            </div>
            <div className="table table--payment-detail payments__table">
              <div className="table__body">
                <div className="table__row">
                  <div className="table__cell">
                    Rent for 1 month
                  </div>
                  <div className="table__cell">$1000</div>
                </div>
                <div className="table__row">
                  <div className="table__cell">
                    Service fee
                  </div>
                  <div className="table__cell">$150</div>
                </div>
                <div className="table__row">
                  <div className="table__cell">
                    Total
                  </div>
                  <div className="table__cell">$1150</div>
                </div>
              </div>
            </div>
          </div>
          <div className="payments__nav">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark form-button--cancel"
              // disabled={submitting}
              // onClick={previousPage}
              type="button"
            >
              <span>Decline</span>
            </Form.Button>

            <Form.Button
              className="form-button form-button--user-action form-button--circle form-button--pink"
              // disabled={submitting}
              type="submit"
            >
              <span>Approve</span>
            </Form.Button>
          </div>
      </div>
    );
  }

}
