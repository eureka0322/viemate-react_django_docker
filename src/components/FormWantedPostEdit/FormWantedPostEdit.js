// /api/v2/posts/:post_id/attachments/:id/set_main POST
import React, { Component, PropTypes } from 'react';
import { SaveBlock } from 'components';
import { connect } from 'react-redux';
import { Form, Modal, Loader } from 'elements';
import { withRouter } from 'react-router';
import { reduxForm, Field } from 'redux-form';
import PostFormValidation from 'components/Post/PostFormValidation';
import { scrollToFirstError, tagsToString, handlePageReload } from 'utils/helpers';
import { load, edit, activate } from 'redux/modules/product';
import { confirmLeave, confirmNeeded } from 'redux/modules/onLeave';
import { showDefault } from 'redux/modules/notifications';
import locations from 'utils/available_cities';

const renderInputHidden = field =>
  <Form.InputHidden
    field={field}
    {...field}
  />;

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

const renderRadio = field =>
  <Form.Radio
    field={field}
    {...field}
  />;

const renderCheckbox = field =>
  <Form.Checkbox
    field={field}
    {...field}
  />;

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

const renderTextarea = field =>
  <Form.Textarea
    field={field}
    {...field}
  />;

@connect(
  state => ({
    product: state.product.product,
    leave_confirmation: state.onLeave.confirmation,
    loading: state.product.loading,
    errors: state.formErrors,
    friendly: state.initialAppState.friendly,
    included: state.initialAppState.included,
    nearby: state.initialAppState.nearby,
    user: state.auth.user,
  }),
  {
    loadProduct: load,
    editProduct: edit,
    confirmNeeded,
    confirmLeave,
    showDefault,
    activate
  }
)
@reduxForm({
  form: 'form-edit-post',
  validate: PostFormValidation,
  // destroyOnUnmount: false,
  // enableReinitialize: true,
  touchOnBlur: false,
  onSubmitFail: (errors) => {
    scrollToFirstError(errors, 92);
  }
})
@withRouter
export default class EditPostForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func,
    reset: PropTypes.func,
    loadProduct: PropTypes.func,
    editProduct: PropTypes.func,
    confirmNeeded: PropTypes.func,
    confirmLeave: PropTypes.func,
    showDefault: PropTypes.func,
    dispatch: PropTypes.func,
    activate: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    leave_confirmation: PropTypes.bool,
    loading: PropTypes.bool,
    product: PropTypes.object,
    params: PropTypes.object,
    router: PropTypes.object,
    route: PropTypes.object,
    errors: PropTypes.object,
    // user: PropTypes.object,
    friendly: PropTypes.array,
    included: PropTypes.array,
    nearby: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {
      confirmation_opened: false
    };

    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.handleRouteLeave = ::this.handleRouteLeave;
    this.openConfirmModal = ::this.openConfirmModal;
    this.closeConfirmModal = ::this.closeConfirmModal;
    this.handleSaveAndClose = ::this.handleSaveAndClose;
    this.handleClearAndClose = ::this.handleClearAndClose;

    this._handlePageReload = handlePageReload.bind(this);
  }

  componentDidMount() {
    const { product, params: { id } } = this.props;
    // console.log('ID', id);
    // console.log('PRODUCT_ID', product.id);

    if (product.id && +id === product.id) {
      this.props.initialize(this.handleEdit(product));
    } else {
      this.props.loadProduct(id)
        .then(_product => {
          // console.log('LOAD', _product);
          this.props.initialize(this.handleEdit(_product.post));
        }, err => console.log(err));
    }

    this.props.router.setRouteLeaveHook(this.props.route, this.handleRouteLeave);

    window.addEventListener('beforeunload', this._handlePageReload);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pristine && !nextProps.pristine) {
      this.props.confirmNeeded();
    }
    if (!this.props.pristine && nextProps.pristine) {
      this.props.confirmLeave();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this._handlePageReload);
    this.props.confirmLeave();
  }

  formatDate(date) {
    // convert moment object
    return date.format('YYYY-MM-DD');
  }

  handleSubmit(data) {
    const postId = data.id;
    const location = data.address;

    data = {
      ...data,
      start_date: this.formatDate(data.dates_range.startDate),
      end_date: this.formatDate(data.dates_range.endDate)
    };
    delete data.dates_range;

    data = tagsToString(data, /lease_type_/);

    // console.log('DATA_SUBMIT', data);

    const activatePost = (status) => {
      if (status === 'initialization') {
        return this.props.activate(postId);
      }
      return Promise.resolve();
    };

    return activatePost(data.status)
      .then(() => this.props.editProduct(data))
      .then(() => {
        this.props.confirmLeave().then(() => {
          this.props.showDefault('product_success');
          if (!this.state.external_route) this.props.router.push(`/wanted-apartments/${location}/${postId}`);
        });
      })
      .catch(e => console.log(e));
  }

  handleEdit(post) {
    if (post.tag_list) {
      post.tag_list.forEach(c => {
        post[`${c}`] = true;
      });
      delete post.tag_list;
    }
    const productValues = {
      ...post,
      price: parseFloat(post.price.replace(/,/g, '')),
      dates_range: { startDate: post.start_date, endDate: post.end_date },
    };

    delete productValues.start_date;
    delete productValues.end_date;

    // console.log('VALUES', productValues);
    return productValues;
  }

  handleRouteLeave(param) {
    this.setState({next_location: param});
    if (this.props.leave_confirmation) {
      this.openConfirmModal();
      return false;
    }
    return true;
  }

  handleSaveAndClose() {
    this.setState({external_route: true}, () =>
      this.props.dispatch(this.props.handleSubmit(this.handleSubmit)).then(() => {
        this.closeConfirmModal();
        this.props.router.push({pathname: this.state.next_location.pathname, query: this.state.next_location.query});
      })
    );
  }

  handleClearAndClose() {
    this.props.confirmLeave().then(() => {
      this.closeConfirmModal();
      this.props.router.push({pathname: this.state.next_location.pathname, query: this.state.next_location.query});
    });
  }

  handleReset() {
    this.props.reset();
  }

  openConfirmModal() {
    this.setState({confirmation_opened: true});
  }

  closeConfirmModal() {
    this.setState({confirmation_opened: false});
  }

  render() {
    const { handleSubmit, submitting, pristine, errors, friendly, included, nearby } = this.props;
    // console.log('PHOTO', photo);
    // console.log('PRODUCT', product);
    // console.log('PROPS', this.props);

    return (
      <div>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="container container--extra-xs-width">
            <div className="post-edit__section post-edit__section--place-name post-edit__section--no-title">
              <div className="post-edit__item post-edit__item--price post-form__item--price">
                <Field
                  classNameInput="form-control input input--price"
                  classNameLabel="post-form__label"
                  name="price"
                  type="text"
                  component={renderInput}
                  label="Price"
                  placeholder="$"
                />
              </div>
            </div>
            <div className="post-edit__section post-edit__calendar">
              <Form.DateRangePicker
                name="dates_range"
                numberOfMonths={1}
                startDateId="start_date"
                endDateId="end_date"
                startDateLabel="Available from"
                endDateLabel="Available to"
                minimumNights={30}
                moveToFocus
              />
            </div>
          </div>
          <div className="post-edit__section post-edit__section--lease-type">
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
                  value="rent_temporary"
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
                  value="takeover"
                  multipleValidationName="lease_type"
                />
              </div>
              {errors.lease_type && <Form.RadioMessage field={'lease_type'} />}
            </div>
          </div>
          <div className="post-edit__section post-edit__section--type-rooms">
            <div className="post-form__label post-form__label--type-rooms-label">Property type</div>
            <div className="form-radio__group post-form__wrapper-element">
              <Field
                classNameIcon="form-radio__icon form-radio__icon--black"
                classNameCaption="form-radio__label form-radio__label--caption"
                classNameLabel="form-radio__label"
                name="place_type"
                type="radio"
                component={renderRadio}
                label="Entire apartment"
                caption="If you prefer to rent an entire apartment e.g. studio, one bedroom"
                value="entire_apt"
              />
              <Field
                classNameIcon="form-radio__icon form-radio__icon--black"
                classNameCaption="form-radio__label form-radio__label--caption"
                classNameLabel="form-radio__label"
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
                name="place_type"
                type="radio"
                component={renderRadio}
                label="Shared room"
                caption="If you want to rent a shared bedroom, and save money."
                value="shared_room"
              />
            </div>
          </div>
          <div className="post-edit__section post-edit__section--details">
            <div className="post-form__section post-form__section--select-option">
              <div className="post-form__label post-form__label--select-label">Furnished</div>
              <div className="select-custom select-custom--xs select-custom--lg-h">
                <Field
                  name="furnished"
                  list={[{ value: '', label: 'Any' }, { value: 1, label: 'Yes' }, { value: 0, label: 'No' }]}
                  type="checkbox"
                  component={renderSelectbox}
                  defaultLabel="Yes"
                  label="User Roles"
                />
              </div>
            </div>
            <div className="post-form__section post-form__section--select-gender">
              <div className="post-form__label post-form__label--select-label">Preferred gender</div>
                <div className="select-custom select-custom--sm select-custom--lg-h">
                  <Field
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
            </div>
            {friendly &&
              <div className="post-edit__section post-edit__section--tags">
                <h4 className="product-tags__title">FRIENDLY</h4>
                <ul className="list-unstyled post-edit__tags-list">
                {friendly.map((c, i) =>
                  <li key={i}>
                    <Field
                      classNameLabel="form-checkbox__label form-checkbox__label--tag"
                      name={`${c.name}`}
                      type="checkbox"
                      component={renderCheckbox}
                      label={`${c.name}`}
                    />
                  </li>
                )}
                </ul>
              </div>
            }
            {included &&
              <div className="post-edit__section post-edit__section--tags">
                <h4 className="product-tags__title">INCLUDED</h4>
                <ul className="list-unstyled post-edit__tags-list">
                {included.map((c, i) =>
                  <li key={i}>
                    <Field
                      classNameLabel="form-checkbox__label form-checkbox__label--tag"
                      name={`${c.name}`}
                      type="checkbox"
                      component={renderCheckbox}
                      label={`${c.name}`}
                    />
                  </li>
                )}
                </ul>
              </div>
            }
            {nearby &&
              <div className="post-edit__section post-edit__section--tags">
                <h4 className="product-tags__title">Accessible Nearby</h4>
                <ul className="list-unstyled post-edit__tags-list">
                {nearby.map((c, i) =>
                  <li key={i}>
                    <Field
                      classNameLabel="form-checkbox__label form-checkbox__label--tag"
                      name={`${c.name}`}
                      type="checkbox"
                      component={renderCheckbox}
                      label={`${c.name}`}
                    />
                  </li>
                )}
                </ul>
              </div>
            }
            <div className="post-edit__section post-edit__description">
              <Field
                classNameLabel="post-form__label"
                className="textarea--count"
                name="description"
                component={renderTextarea}
                label="Description"
                placeholder="What would you like tenants or roommates to know about your place?"
                maxLength={2000}
                row={8}
              />
            </div>
            <div className="post-edit__section post-edit__section--location">
              <div className="post-form__label post-form__label--select-label">Location</div>
              <div className="select-custom select-custom--sm select-custom--lg-h">
                <Field
                  name="address"
                  list={locations}
                  type="checkbox"
                  component={renderSelectbox}
                  label="Location"
                />
              </div>
            </div>
            <div className="post-edit__nav">
              <Form.Button
                className="form-button form-button--user-action form-button--default-dark"
                disabled={submitting || pristine}
                type="button"
                onClick={this.handleReset}
              >
                <span>Cancel</span>
              </Form.Button>
              <Form.Button
                disabled={submitting}
                className={'form-button form-button--user-action form-button--circle form-button--pink form-button--loader' + (submitting ? ' form-button--loading' : '')}
                type="submit"
              >
                <span>Save</span>
              </Form.Button>
            </div>
            <Field
              name="preview"
              type="hidden"
              component={renderInputHidden}
            />
        </form>

        {this.props.loading && !submitting && <Loader />}
        <Modal
          className="modal--save-block"
          handleClose={this.closeConfirmModal}
          opened={this.state.confirmation_opened}
        >
          <SaveBlock handleSave={this.handleSaveAndClose} handleClear={this.handleClearAndClose} disabled={submitting} />
        </Modal>
      </div>
    );
  }
}
