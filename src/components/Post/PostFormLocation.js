import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { PostHeader } from '.';
import { Map } from 'components';
import { Form } from 'elements';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import PostFormValidation from './PostFormValidation';
import { scrollToFirstError } from 'utils/helpers';

let customAutocomplete = false;

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

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

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

@connect(
  state => ({
    errors: state.formErrors,
    center: state.products.center,
    coordinatesValues: formValueSelector('form-manage-post')(state, 'coordinates')
  })
)
@reduxForm({
  form: 'form-manage-post',
  validate: PostFormValidation,
  destroyOnUnmount: false,
  // enableReinitialize: true,
  onSubmitFail: (errors) => {
    if (!errors.street_name && errors.coordinates && !customAutocomplete) {
      // the order is important
      // we need to add street_name at the top of the object
      errors = {street_name: 'this error message doesn\'t matter', ...errors};
    }
    scrollToFirstError(errors, 122);
  }
})
export default class PostFormLocation extends Component {
  static propTypes = {
    error: PropTypes.string,
    errors: PropTypes.object,
    coordinatesValues: PropTypes.object,
    center: PropTypes.object,
    change: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    untouch: PropTypes.func, // eslint-disable-line
    setAutocompleteState: PropTypes.func,
    submitting: PropTypes.bool.isRequired,
    custom_autocomplete: PropTypes.bool,
    nearby: PropTypes.array,
  };

  constructor() {
    super();

    this.handleCustomAutocomplete = ::this.handleCustomAutocomplete;
  }

  handleCustomAutocomplete() {
    this.props.setAutocompleteState({
      autocomp_modal_is_opened: true
    });
  }

  render() {
    const { handleSubmit, error, errors, previousPage, submitting, change, coordinatesValues, custom_autocomplete, nearby, center } = this.props;
    customAutocomplete = custom_autocomplete; // for onSUbmitFail
    // console.log('MAP_PROPS', this.props);

    return (
      <div>
        <PostHeader className="icon--location-type" title="Location & Type" subtitle="Where is your place?" />
        <form className="post-form" action="" method="post" onSubmit={handleSubmit}>
          <div className="post-form__section post-form__section--location">
            <div className="post-form__address">
              <div className="post-form__item post-form__item--md post-form__item--first">
                <Form.MapAutocomplete
                  classNameInput="form-control input input--address"
                  classNameLabel="post-form__label"
                  disabled={submitting || custom_autocomplete}
                  name="street_name"
                  coordinatesName="coordinates"
                  label="Address: Street number and name"
                  placeholder="Sadama 9"
                  neighborhoodName="neighbourhood"
                  postalCodeName="zip_code"
                  stateName="state"
                  changeForm={change}
                  addErrorToWrap
                  hideCoordinates={custom_autocomplete}
                  disableChangeCoordinates={custom_autocomplete}
                  addressData
                />
              </div>
              <div className="post-form__item post-form__item--xs post-form__item--second">
                <Field
                  classNameInput="form-control input input--text-center input--address"
                  classNameLabel="post-form__label"
                  disabled={submitting || custom_autocomplete}
                  name="street_unit"
                  type="text"
                  component={renderInput}
                  label="Unit no."
                  placeholder=""
                />
              </div>
              <div className="post-form__item post-form__item--sm post-form__item--third">
                <Field
                  classNameInput="form-control input input--text-center"
                  classNameLabel="post-form__label"
                  disabled={submitting || custom_autocomplete}
                  name="zip_code"
                  type="text"
                  component={renderInput}
                  label="Zip code"
                  placeholder="0"
                />
              </div>
              <div className="post-form__item post-form__item--sm-l post-form__item--fourth">
                <Field
                  classNameInput="form-control input"
                  classNameLabel="post-form__label"
                  name="state"
                  type="text"
                  component={renderInput}
                  label="State"
                  placeholder=""
                  disabled
                />
              </div>
              <div className="post-form__item post-form__item--sm-xl post-form__item--fifth">
                <Field
                  classNameInput="form-control input"
                  classNameLabel="post-form__label"
                  name="neighbourhood"
                  type="text"
                  component={renderInput}
                  label="Neighborhood"
                  placeholder=""
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="post-form__section post-form__section--nav">
            <Form.Button
              className="form-button form-button--add-address form-button--circle form-button--base-grey"
              disabled={submitting}
              type="button"
              onClick={this.handleCustomAutocomplete}
            >
              <span>Cannot find my address</span>
            </Form.Button>
          </div>
          <div className="product-map">
            <p className="product-map__title">Your exact address will be hidden. We will only show estimated location.</p>
            <Map
              scrollwheel={false}
              zoom={coordinatesValues && 15}
              center={coordinatesValues || center}
              markers={coordinatesValues && [coordinatesValues]}
              circles={coordinatesValues && [coordinatesValues]}
              changeForm={change}
              coordinatesName="coordinates"
              autocompleteName="street_name"
              postalCodeName="zip_code"
              neighborhoodName="neighbourhood"
              stateName="state"
              zoomControl
              draggableMarker
            />
          </div>
          {nearby &&
            <div className="post-form__section post-form__section--checkdox-tags">
              <div className="post-form__label post-form__label--label-checkbox-tags">Accessible Nearby</div>
              <ul className="list-unstyled post-form__checkbox-lists">
              {nearby.map((c, i) =>
                <li key={i}>
                  <Field
                    classNameLabel="form-checkbox__label form-checkbox__label--tag"
                    disabled={submitting}
                    name={`${c.name}`}
                    type="checkbox"
                    component={renderCheckbox}
                    label={`${c.name}`}
                  />
                </li>
              )}
                {/*<li>
                  <Form.Button
                    className="form-button form-button--light-grey"
                    type="button"
                  >
                    <span>Show next +30 tags</span>
                  </Form.Button>
                </li>*/}
              </ul>
            </div>
          }
          <div className="post-form__section post-form__section--type-rooms">
            <div className="post-form__label post-form__label--type-rooms-label">Place type</div>
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
                caption="If you are renting out and entire apartment e.g. studio, one bedroom"
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
                caption="If you are renting out a room in a shared apartment."
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
                caption="If you are renting a shared bedroom. Shared bedroom will be in shared apartment/house."
                value="shared_room"
              />
            </div>
            {errors.place_type && <Form.RadioMessage field={'place_type'} />}
          </div>
          <div className="post-form__section post-form__section--select-option">
            <div className="post-form__label post-form__label--select-label">Furnished</div>
            <div className="select-custom select-custom--xs select-custom--lg-h">
              <Field
                disabled={submitting}
                name="furnished"
                list={[{ value: '', label: 'Any'}, { value: 1, label: 'Yes'}, { value: 0, label: 'No' }]}
                type="checkbox"
                component={renderSelectbox}
                defaultLabel="Yes"
                label="User Roles"
              />
            </div>
          </div>
          <div className="post-form__section post-form__section--select-gender">
            <div className="post-form__label post-form__label--select-label">Preferred gender</div>
            <div className="select-custom select-custom--sm select-custom--lg-h select-custom--gender">
              <Field
                disabled={submitting}
                name="gender"
                list={[{ value: '', label: 'Any' }, { value: 'male', label: 'Men' }, { value: 'female', label: 'Women' }]}
                type="checkbox"
                placeholder="Any"
                component={renderSelectbox}
                defaultLabel="Any"
              />
            </div>
          </div>
          <div className="post-form__section post-form__section--form-nav post-form__nav post-form__nav--step-2">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark form-button--cancel"
              disabled={submitting}
              onClick={previousPage}
              type="button"
            >
              <span>Back</span>
            </Form.Button>

            <Form.Button
              className="form-button form-button--user-action form-button--circle form-button--pink"
              disabled={submitting}
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
