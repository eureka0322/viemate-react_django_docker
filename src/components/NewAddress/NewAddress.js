import React, { Component, PropTypes } from 'react';
import {} from './NewAddress.scss';
import { Form } from 'elements';
import { reduxForm, Field } from 'redux-form';
import PostFormValidation from '../Post/PostFormValidation';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

@reduxForm({
  form: 'form-custom-autocomplete',
  validate: PostFormValidation,
  destroyOnUnmount: false
})
export default class NewAddress extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    changeForm: PropTypes.func,
    setAutocompleteState: PropTypes.func
  };

  constructor() {
    super();
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    const { changeForm, setAutocompleteState } = this.props;
    const fieldsArr = ['coordinates', 'street_unit', 'state', 'neighbourhood']; // the fields that need to be cleared first

    fieldsArr.forEach(c => changeForm(c, null));
    Object.keys(data).forEach(c => changeForm(c, data[c]));

    setAutocompleteState({
      custom_autocomplete: true,
      autocomp_modal_is_opened: false
    });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="address-container address-container--popup">
        <div className="address-container__wrapper">
          <h1 className="address-container__title">Enter your address</h1>
          <form className="address-container__form" onSubmit={handleSubmit(this.handleSubmit)}>
            <div className="address-container__form-row">
              <div className="address-container__form-item address-container__form-item--first">
                <Field
                  classNameInput="form-control input input--sm"
                  // disabled={submitting}
                  name="street_name"
                  type="text"
                  component={renderInput}
                  placeholder="Your street number and address"
                />
              </div>
              <div className="address-container__form-item address-container__form-item--second">
                <Field
                  classNameInput="form-control input input--sm"
                  // disabled={submitting}
                  name="neighbourhood"
                  type="text"
                  component={renderInput}
                  placeholder="neighborhood"
                />
              </div>
            </div>
            <div className="address-container__form-row address-container__form-row--last-child">
              <div className="address-container__form-item address-container__form-item--third">
                <Field
                  classNameInput="form-control input input--sm"
                  // disabled={submitting}
                  name="street_unit"
                  type="text"
                  component={renderInput}
                  placeholder="Unit no."
                />
              </div>
              <div className="address-container__form-item address-container__form-item--fourth">
                <Field
                  classNameInput="form-control input input--sm"
                  // disabled={submitting}
                  name="state"
                  type="text"
                  component={renderInput}
                  placeholder="State"
                />
              </div>
              <div className="address-container__form-item address-container__form-item--fifth">
                <Field
                  classNameInput="form-control input input--sm"
                  // disabled={submitting}
                  name="zip_code"
                  type="text"
                  component={renderInput}
                  placeholder="Zip code"
                />
              </div>
            </div>
            <div className="info-box__nav table">
              <div className="info-box__panel-info table__cell">
                <i className="icon icon--worry" />
                <span className="info-text info-text--new-address">Commercial addresses will not be approved</span>
              </div>
              <div className="info-box__nav-btn table__cell">
                <button className="form-button form-button--pink form-button--circle" type="submit">
                  <span>Send</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
