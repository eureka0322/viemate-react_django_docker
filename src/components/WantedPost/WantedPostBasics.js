import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Post, Map } from 'components';
import { Form } from 'elements';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import wantedPostValidation from './wantedPostValidation';
import { scrollToFirstError } from 'utils/helpers';
import location_bounds from 'utils/location_bounds';

const renderCheckbox = field =>
  <Form.Checkbox
    field={field}
    {...field}
  />;

const renderRadio = field =>
  <Form.Radio
    field={field}
    {...field}
  />;

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

const renderTextarea = field =>
  <Form.Textarea
    field={field}
    {...field}
  />;

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

@connect(
  state => ({
    errors: state.formErrors,
    coordinatesValues: formValueSelector('form-wanted-post')(state, 'coordinates'),
    chosen_location: formValueSelector('form-wanted-post')(state, 'address')
  })
)
@reduxForm({
  form: 'form-wanted-post',
  validate: wantedPostValidation,
  destroyOnUnmount: false,
  // enableReinitialize: true,
  onSubmitFail: (errors) => {
    // header height 72px + extraheight === 92px
    scrollToFirstError(errors, 92);
  }
})
export default class WantedPostBasics extends Component {
  static propTypes = {
    chosen_location: PropTypes.string,
    error: PropTypes.string,
    errors: PropTypes.object,
    coordinatesValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func,
    pristine: PropTypes.bool,
    disablePristine: PropTypes.bool,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    locations: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.changeLocation = ::this.changeLocation;
  }

  componentDidMount() {
    const {chosen_location} = this.props;
    if (chosen_location) {
      this.changeLocation(chosen_location);
    }
  }

  changeLocation(location) {
    if (location_bounds[location]) {
      this.setState({
        city_center: location_bounds[location].center || null,
      });
    }
  }

  render() {
    const { handleSubmit, error, errors, reset, submitting, pristine, disablePristine, change, coordinatesValues, locations } = this.props;
    const { city_center } = this.state;
    // console.log(this.props);

    return (
      <div>
        <Post.PostHeader className="icon--information" title="Tell us about the place you are looking for" subtitle="Your budget, move in date, work or school..." />
        <form className="post-form post-form__wanted-place" action="" method="post" onSubmit={handleSubmit}>
          <div className="post-form__section post-form__time-period">
            <div className="post-form__item post-form__item--calendar">
              <Form.DateRangePicker
                name="dates_range"
                numberOfMonths={1}
                startDateId="start_date"
                endDateId="end_date"
                startDateLabel="Available from"
                endDateLabel="To"
                minimumNights={30}
                moveToFocus
              />
            </div>
            <div className="post-form__item post-form__item--price">
              <Field
                classNameInput="form-control input input--price"
                classNameLabel="post-form__label"
                disabled={submitting}
                name="price"
                type="text"
                component={renderInput}
                label="Your maximum budget"
                placeholder="1000"
              />
            </div>
          </div>
          <div className="post-form__section post-form__user-prefers">
            <div className="post-form__item post-form__item--neighborhood">
              <div className="post-form__label post-form__label--select-label">Location</div>
              <div className="select-custom select-custom--full-width select-custom--lg-h">
                <Field
                  disabled={submitting}
                  name="address"
                  list={locations}
                  type="checkbox"
                  component={renderSelectbox}
                  cbFunction={this.changeLocation}
                />
              </div>
            </div>
            <div className="post-form__item post-form__item--select-gender">
              <div className="post-form__label post-form__label--select-label">Preferred gender</div>
              <div className="select-custom select-custom--sm select-custom--lg-h">
                <Field
                  disabled={submitting}
                  name="gender"
                  list={[{ value: '', label: 'Any'}, { value: 'male', label: 'Men' }, { value: 'female', label: 'Women' }]}
                  type="checkbox"
                  component={renderSelectbox}
                  defaultLabel="Yes"
                  placeholder="Yes"
                  label="User Roles"
                />
              </div>
            </div>
            <div className="post-form__item post-form__item--select-option">
              <div className="post-form__label post-form__label--select-label">Furnished</div>
              <div className="select-custom select-custom--xs select-custom--lg-h">
                <Field
                  disabled={submitting}
                  name="furnished"
                  list={[{ value: '', label: 'Any' }, { value: 1, label: 'Yes'}, { value: 0, label: 'No' }]}
                  type="checkbox"
                  component={renderSelectbox}
                  defaultLabel="Yes"
                  label="User Roles"
                />
              </div>
            </div>
          </div>
          <div className="post-form__section post-form__user-prefers">
            <div className="post-form__item post-form__item--neighborhood">
              <Form.MapAutocomplete
                classNameInput="form-control input input--neighborhood"
                classNameLabel="post-form__label"
                disabled={submitting}
                name="neighbourhood"
                coordinatesName="coordinates"
                label="Live close to (optional, but it will help us narrow down the search)"
                placeholder="Work, university, gym"
                changeForm={change}
                fillAs={'neighborhood'} // neighbOrhood! street_number, postalCode, neighborhood
              />
            </div>
          </div>
          <div className="product-map">
            <p className="product-map__title">This is where you want to live nearby.</p>
            <Map scrollwheel={false}
              defaultZoom={13}
              center={coordinatesValues || city_center}
              markers={coordinatesValues && [coordinatesValues]}
              zoomControl
            />
          </div>
          <div className="post-form__section post-form__section--type-rooms">
            <div className="post-form__label post-form__label--checkbox-title">Lease type</div>
            <div className="post-form__container">
              <div className={'form-checkbox__checkbox-group post-form__wrapper-element filter-form--rent-type' + (errors.lease_type ? ' group-has-error' : '')}>
                <Field
                  classNameIcon="form-checkbox__icon form-checkbox__icon--pink"
                  classNameCaption="form-checkbox__label form-checkbox__label--caption"
                  classNameLabel="form-checkbox__label"
                  disabled={submitting}
                  name="lease_type_temporary"
                  type="checkbox"
                  component={renderCheckbox}
                  label="Temporary sublet"
                  caption="If you are only staying for few months."
                  multipleValidationName="lease_type"
                />
                <Field
                  classNameIcon="form-checkbox__icon form-checkbox__icon--pink"
                  classNameCaption="form-checkbox__label form-checkbox__label--caption"
                  classNameLabel="form-checkbox__label"
                  disabled={submitting}
                  name="lease_type_take_over"
                  type="checkbox"
                  component={renderCheckbox}
                  label="Lease takeover"
                  caption="If you are moving to the city for a school or a job."
                  multipleValidationName="lease_type"
                />
              </div>
              {errors.lease_type && <Form.RadioMessage field={'lease_type'} />}
            </div>
          </div>
          <div className="post-form__section post-form__section--type-rooms">
            <div className="post-form__label post-form__label--type-rooms-label">Property type</div>
            <div className={'form-radio__group post-form__wrapper-element ' + (errors.place_type ? 'group-has-error' : '')}>
              <Field
                classNameIcon="form-radio__icon form-radio__icon--black"
                classNameCaption="form-radio__label form-radio__label--caption"
                classNameLabel="form-radio__label"
                disabled={submitting}
                name="place_type"
                type="radio"
                component={renderRadio}
                label="Entire apartment"
                caption="If you prefer to rent an entire apartment e.g. studio, one bedroom."
                value="entire_apt"
              />
              <Field
                classNameIcon="form-radio__icon form-radio__icon--black"
                classNameCaption="form-radio__label form-radio__label--caption"
                classNameLabel="form-radio__label"
                disabled={submitting}
                name="place_type"
                type="radio"
                component={renderRadio}
                label="Private room"
                caption="If you are looking to rent a private room in a shared apartment."
                value="private_room"
              />
              <Field
                classNameIcon="form-radio__icon form-radio__icon--black"
                classNameCaption="form-radio__label form-radio__label--caption"
                classNameLabel="form-radio__label"
                disabled={submitting}
                name="place_type"
                type="radio"
                component={renderRadio}
                label="Shared room"
                caption="If you want to rent a shared bedroom, and save money."
                value="shared_room"
              />
            </div>
            {errors.place_type && <Form.RadioMessage field={'place_type'} />}
          </div>
          <div className="post-form__section post-form__description">
            <div className="form-group post-form__item">
              <Field
                classNameLabel="post-form__label"
                className="textarea--count"
                disabled={submitting}
                name="description"
                component={renderTextarea}
                label="Description"
                placeholder="Text to edit"
                maxLength={2000}
                row={8}
              />
            </div>
          </div>
          <div className="post-form__section post-form__nav">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark"
              disabled={(!disablePristine && pristine) || submitting}
              onClick={reset}
              type="button"
            >
              <span>Reset</span>
            </Form.Button>

            <Form.Button
              className="form-button form-button--user-action form-button--circle form-button--pink"
              disabled={(!disablePristine && pristine) || submitting}
              type="submit"
            >
              <span>Next</span>
            </Form.Button>

            {error ? <Form.Alert title={error || ''} className="alert-danger" /> : null}
          </div>
        </form>

      </div>

    );
  }
}
