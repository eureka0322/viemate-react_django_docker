// /api/v2/posts/:post_id/attachments/:id/set_main POST
import React, { Component, PropTypes } from 'react';
import {} from './FormPostEdit.scss';
import { Map, SaveBlock } from 'components';
import { connect } from 'react-redux';
import { Form, Modal, Loader, ProgressBar } from 'elements';
import { Link, withRouter } from 'react-router';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import PostFormValidation from 'components/Post/PostFormValidation';
import { scrollToFirstError, tagsToString, handlePageReload } from 'utils/helpers';
import { load, edit, delAttach, addAttach, setCover, activate } from 'redux/modules/product';
import { confirmLeave, confirmNeeded } from 'redux/modules/onLeave';
import { showDefault } from 'redux/modules/notifications';
import constants from 'utils/constants';
import cx from 'classnames';

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
    photo: formValueSelector('form-edit-post')(state, 'photo'),
    // preview: formValueSelector('form-edit-post')(state, 'preview'),
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
    delAttach,
    addAttach,
    setCover,
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
    change: PropTypes.func,
    initialize: PropTypes.func,
    reset: PropTypes.func,
    loadProduct: PropTypes.func,
    editProduct: PropTypes.func,
    confirmNeeded: PropTypes.func,
    confirmLeave: PropTypes.func,
    showDefault: PropTypes.func,
    dispatch: PropTypes.func,
    delAttach: PropTypes.func,
    addAttach: PropTypes.func,
    setCover: PropTypes.func,
    activate: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    leave_confirmation: PropTypes.bool,
    loading: PropTypes.bool,
    photo: PropTypes.array,
    product: PropTypes.object,
    params: PropTypes.object,
    router: PropTypes.object,
    route: PropTypes.object,
    errors: PropTypes.object,
    // user: PropTypes.object,
    // preview: PropTypes.object,
    friendly: PropTypes.array,
    included: PropTypes.array,
    nearby: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {
      previewIndex: 0,
      confirmation_opened: false,
      progressArr: [0],
      curPercent: 0
    };
    this.removedIds = [];
    this.tempProgressArr = [0];
    this._curPercent = 0;

    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.handleRouteLeave = ::this.handleRouteLeave;
    this.openConfirmModal = ::this.openConfirmModal;
    this.closeConfirmModal = ::this.closeConfirmModal;
    this.handleSaveAndClose = ::this.handleSaveAndClose;
    this.handleClearAndClose = ::this.handleClearAndClose;
    this.handleCoverReplace = ::this.handleCoverReplace;
    this.handleProgress = ::this.handleProgress;
    this.handleUpload = ::this.handleUpload;

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

  handleProgress(e, i) { // eslint-disable-line
    // clearTimeout(this._timer);
    const progressArr = [...this.tempProgressArr];

    progressArr[i] = e.percent || 100;
    this.tempProgressArr = progressArr;
    this._curPercent = Math.round(progressArr.reduce((t, c) => +t + +c, 0) / progressArr.length);

    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      if (this._curPercent !== this.state.curPercent) {
        this.setState({
          progressArr,
          curPercent: this._curPercent
        });
      }
    }, 50);

    // console.log(e);
  }

  handleUpload(postId, obj) {
    const promises = [];
    const files = obj.file;
    // fill temp progress array with empty values
    this.tempProgressArr = Array(...Array(files.length)).map(() => 0);

    files.forEach((c, i) => {
      promises.push(this.props.addAttach(postId, {
        file: [c],
        ...(obj.coverIndex && obj.coverIndex === i ? {main: 'file_0'} : {})
      }, e => this.handleProgress(e, i)));
    });

    return Promise.all(promises);
  }

  handleSubmit(data) {
    const attach = data.photo.filter(c => !!c.preview);
    const previewObj = data.preview || {};
    const coverIndex = previewObj.file || 0;
    const postId = data.id;
    const location = data.address;

    data = {
      ...data,
      start_date: this.formatDate(data.dates_range.startDate),
      end_date: this.formatDate(data.dates_range.endDate),
      latitude: data.coordinates.lat,
      longitude: data.coordinates.lng
    };
    delete data.dates_range;
    delete data.coordinates;
    delete data.photo;
    delete data.preview;

    // console.log('ATTACH', attach);
    // console.log('DATA_SUBMIT', data);
    data = tagsToString(data, /lease_type_/);

    // remove files
    return Promise.all(this.removedIds.map(attachId => this.props.delAttach(postId, attachId)))
      // add new files
      .then(() => attach.length ? this.handleUpload(postId, {
        file: attach,
        // set cover as index of the new files array if cover was selected as a new file
        ...(previewObj.newFile ? { coverIndex } : {})
      }) : Promise.resolve())
      // set cover as existing file with id if cover was selected as an existing file
      .then(() => ('newFile' in previewObj && !previewObj.newFile) ? this.props.setCover(postId, coverIndex) : Promise.resolve())
      .then(() => data.status === 'initialization' ? this.props.activate(postId) : Promise.resolve())
      .then(() => this.props.editProduct(data))
      .then(() => {
        this.props.confirmLeave().then(() => {
          this.props.showDefault('product_success');
          if (!this.state.external_route) this.props.router.push(`/apartments/${location}/${postId}`);
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
      coordinates: { lat: post.latitude, lng: post.longitude },
      photo: post.attachments
    };
    // if (!post.attachments.length) this.hideDropzone = true;

    delete productValues.start_date;
    delete productValues.end_date;
    delete productValues.latitude;
    delete productValues.longitude;
    delete productValues.attachments;

    // console.log('VALUES', productValues);
    return productValues;
  }

  handleDelete(e, previewIndex = 0, delIndex = 0, removedAttach) {
    const filteredPhoto = this.props.photo.filter((c, i) => i !== delIndex);
    const attachId = removedAttach.id;

    if (delIndex <= previewIndex) {
      let index = previewIndex - 1;

      if (index < 0) index = 0;
      if (filteredPhoto.length) this.handleCover(filteredPhoto[index], filteredPhoto);
      this.setState({ previewIndex: index });
    }

    if (!filteredPhoto.length) {
      this.props.change('preview', null);
    }

    this.props.change('photo', filteredPhoto);

    if (attachId) this.removedIds.push(attachId);
    // console.log('REMOVED_INDEXES', this.removedIds);

    e.stopPropagation();
  }

  handlePreview(previewIndex, item, arr) {
    if (this.state.previewIndex !== previewIndex) {
      this.setState({ previewIndex });
      this.handleCover(item, arr);
    }
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
    this.setState({previewIndex: 0});
    this.removedIds = [];
  }

  handleCover(item, arr) {
    if (item.id) { // clicked element is an old file with id
      this.props.change('preview', {
        file: item.id,
        newFile: false
      });
    } else { // clicked element is a new file
      const index = arr.filter(c => !!c.preview).findIndex(c => c.preview === item.preview);
      this.props.change('preview', {
        file: index,
        newFile: true
      });
    }
  }

  handleCoverReplace(f, files, replacedFile) { // cur added file, array with files, prev file that has been replaced
    if (!f || (f && !f.length)) return;

    this.handleCover(f[0], files);
    if (replacedFile && replacedFile.id) this.removedIds.push(replacedFile.id);
  }

  openConfirmModal() {
    this.setState({confirmation_opened: true});
  }

  closeConfirmModal() {
    this.setState({confirmation_opened: false});
  }

  render() {
    const { handleSubmit, photo, product, submitting, pristine, errors, friendly, included, nearby } = this.props; // eslint-disable-line
    const { previewIndex } = this.state;

    let coordinates;
    if (product.latitude) {
      coordinates = {
        lat: product.latitude,
        lng: product.longitude
      };
    }
    const hasPhoto = photo && !!photo.length;
    const noPhoto = !photo || (photo && !photo.length);

    // console.log('PHOTO', photo);
    // console.log('PRODUCT', product);
    // console.log('PREVIEW_OBJ', this.props.preview);

    return (
      <div>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="container container--extra-xs-width">
            <div className={'post-edit__section post-edit__section--place-name' + (!product.title ? ' post-edit__section--no-title' : '')}>
              {product.title &&
                <div className="post-edit__item post-edit__item--title">
                  <Field
                    classNameInput="form-control input input--location input--count"
                    classNameLabel="post-form__label"
                    name="title"
                    type="text"
                    component={renderInput}
                    label="Title"
                    placeholder=""
                  />
                </div>}
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
            <div className="dropzone-container post-edit__section post-edit__section--dropzone">
              <div className={'post-edit__dropzone-cover' + (photo && !!photo.length ? ' post-form__dropzone-cover--has-img' : '')}>
                <Form.FileInput
                  name="photo"
                  classNameLabel="input-file input-file--label"
                  className="input-file__container input-file__main"
                  dropzone_options={{
                    multiple: false,
                    accept: 'image/*',
                    maxSize: constants.imgMaxSize
                  }}
                  replaceIndex={this.state.previewIndex + []}
                  cbFunction={this.handleCoverReplace}
                >
                  {hasPhoto &&
                    <div className="cover"
                      style={{backgroundImage: photo[previewIndex].urls ? `url(${photo[previewIndex].urls.medium})` : photo[previewIndex].preview ? `url(${photo[previewIndex].preview})` : ''}}
                    />}
                  {noPhoto &&
                    <span className="input-file input-file--default">
                      <i className="icon icon--upload" />
                      <span>Upload pictures</span>
                    </span>}
                  <div className="dropzone-container__panel-link dropzone-container__panel-link--title dropzone-container__panel-link--bottom">Cover image</div>
                </Form.FileInput>
                <div className="post-edit__max-size">
                  {`Max size is ${Math.round((constants.imgMaxSize / 1024 / 1024) * 100) / 100} Mb`}
                </div>
              </div>
              <div className="post-form__dropzone-thumbs post-edit__dropzone-thumbs">
                {hasPhoto &&
                  photo.map((c, i) =>
                    <div
                      key={i}
                      className={'dropzone-element dropzone-element--thumb' + (i === previewIndex ? ' dropzone-element--is-cover' : '')}
                      onClick={() => this.handlePreview(i, c, photo)}
                    >
                      <div
                        className="dropzone-element__thumb-wrap"
                        style={{backgroundImage: c.urls ? `url(${c.urls.medium})` : c.preview ? `url(${c.preview})` : ''}}
                      />
                      <button type="button" className="form-button form-button--extra-black form-button--delete-img form-button--around form-button--delete-thumb" onClick={e => this.handleDelete(e, previewIndex, i, c)}>
                        <i className="icon icon--delete-img" />
                      </button>
                    </div>
                  )}
                {(noPhoto || (photo && photo.length < constants.imgMaxItems)) &&
                  <Form.FileInput
                    name="photo"
                    classNameLabel="input-file input-file--label"
                    className="input-file__container input-file__add-more"
                    dropzone_options={{
                      multiple: true,
                      accept: 'image/*',
                      maxSize: constants.imgMaxSize
                    }}
                    multipleFiles
                    maxFiles={constants.imgMaxItems}
                  >
                    <span className="input-file input-file--more">
                      <i className="icon icon--plus" />
                      <span>Add more</span>
                    </span>
                  </Form.FileInput>}
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
                caption="If you are renting out and entire apartment e.g. studio, one bedroom"
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
                caption="If you are renting out a room in a shared apartment."
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
                caption="If you are renting out a shared bedroom. Shared rooms will be in a shared apartment."
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
                    caption="If you are leaving your place for a vacation only."
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
                    caption="If you are looking for someone to takeover your place."
                    value="takeover"
                    multipleValidationName="lease_type"
                  />
                </div>
                {errors.lease_type && <Form.RadioMessage field={'lease_type'} />}
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
            <div className="post-edit__section">
              <div className="post-edit__title-text">Neiborhood</div>
              <div className="post-edit__place-text">{product.neighbourhood || '-'}</div>
              <p className="post-edit__info-text">For security reasons addresses can be only edited throught us. Please
                <Link to="/contact_us" className="form-button form-button--clear form-button--link">reach us </Link>
                <span />  if you wish to adjust the address.
              </p>
            </div>
            {!!coordinates &&
              <Map
                scrollwheel={false}
                center={coordinates}
                // markers={coordinates && [coordinates]}
                circles={coordinates && [coordinates]}
                defaultZoom={15}
                zoomControl
              />}
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
                // disabled
                className={cx('form-button form-button--user-action form-button--circle form-button--pink form-button--loader form-button--progress', {
                  'form-button--loading': submitting,
                  'form-button--uploaded': this._curPercent === 100
                })}
                type="submit"
                dots
              >
                <span>Save</span>
                <ProgressBar
                  className="progress-bar--absolute"
                  progress={this._curPercent}
                  uploadedText="Processing"
                  dots
                />
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
          <SaveBlock
            handleSave={this.handleSaveAndClose}
            handleClear={this.handleClearAndClose}
            disabled={submitting}
            progress={this._curPercent}
            editName="post"
          />
        </Modal>
      </div>
    );
  }
}
