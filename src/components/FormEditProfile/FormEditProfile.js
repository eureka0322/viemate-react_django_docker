import React, { Component, PropTypes } from 'react';
import {} from './FormEditProfile.scss';
// import { Link } from 'react-router';
import { Form, ImageCropper, Modal } from 'elements';
import { reduxForm, Field, getFormValues, SubmissionError } from 'redux-form';
import validate from './profileValidation';
import { connect } from 'react-redux';
import { updateProfile } from 'redux/modules/profile';
import { confirmLeave, confirmNeeded } from 'redux/modules/onLeave';
import { withRouter } from 'react-router';
import { SaveBlock } from 'components';
import { showDefault, showNotification } from 'redux/modules/notifications';
import {clearSpaces} from 'utils/helpers';

const normalizeNumber = (value) => {
  if (!value) return value;
  return value.replace(/[^+\d]/g, '');
};

const renderSelectbox = field =>
  <Form.Selectbox
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

@connect(state => ({
  user: state.auth.user,
  leave_confirmation: state.onLeave.confirmation,
  form_data: getFormValues('edit_profile')(state),
}), {
  updateProfile,
  confirmNeeded,
  confirmLeave,
  showDefault,
  showNotification,
})
@reduxForm({
  form: 'edit_profile',
  enableReinitialize: true,
  validate
})

@withRouter
export default class FormEditProfile extends Component {
  static propTypes = {
    user: PropTypes.object,
    form_data: PropTypes.object,
    updateProfile: PropTypes.func,
    confirmNeeded: PropTypes.func,
    confirmLeave: PropTypes.func,
    showDefault: PropTypes.func,
    showNotification: PropTypes.func,
    route: PropTypes.object,
    leave_confirmation: PropTypes.bool,
    router: PropTypes.object,
    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    // errors: PropTypes.object,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    // initialize: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    // reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    // valid: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation_opened: false,
      external_route: false,
    };
    this.handleSubmit = ::this.handleSubmit;
    this.initializeForm = ::this.initializeForm;
    this.handleRouteLeave = ::this.handleRouteLeave;
    this.openConfirmModal = ::this.openConfirmModal;
    this.closeConfirmModal = ::this.closeConfirmModal;
    this.handleClearAndClose = ::this.handleClearAndClose;
    this.handleSaveAndClose = ::this.handleSaveAndClose;
    this.hanldeCancel = ::this.hanldeCancel;
  }

  componentDidMount() {
    this.initializeForm(this.props);
    this.props.router.setRouteLeaveHook(this.props.route, this.handleRouteLeave);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.props.user) {
      this.initializeForm(nextProps);
    }
    if (this.props.pristine && !nextProps.pristine) {
      this.props.confirmNeeded();
    }
    if (!this.props.pristine && nextProps.pristine) {
      this.props.confirmLeave();
    }
  }

  openConfirmModal() {
    this.setState({confirmation_opened: true});
  }

  closeConfirmModal() {
    this.setState({confirmation_opened: false});
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

  initializeForm(props) {
    const { user, initialize } = props;
    if (user) {
      const initial_state = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        profile_attributes: {...user.profile},
      };
      if (initial_state.profile_attributes && initial_state.profile_attributes.avatar) delete initial_state.profile_attributes.avatar;
      initialize(initial_state);
    }
  }

  handleSubmit(data) {
    const { user } = this.props;
    data = {
      ...data,
      first_name: clearSpaces(data.first_name),
      last_name: clearSpaces(data.last_name),
      profile_attributes: {
        ...data.profile_attributes,
        university: clearSpaces(data.profile_attributes.university),
        hometown: clearSpaces(data.profile_attributes.hometown),
      }
    };
    if (user) {
      return this.props.updateProfile({ user: data }, user.id).then((r) => {
        this.props.confirmLeave().then(() => {
          this.props.showDefault('profile_success');
          if (!this.state.external_route) this.props.router.push('/profile');
        });
        return r;
      }, (err) => {
        if (err.body.error) {
          const errors_keys = Object.keys(err.body.error);
          let errors = {};
          errors_keys.forEach(c => {
            errors = { ...errors, [c]: err.body.error[c][0]};
          });
          throw new SubmissionError({ ...errors});
        }
      });
    }
    return Promise.reject();
  }

  hanldeCancel() {
    this.props.router.push('/profile');
  }


  render() {
    const { pristine, submitting, change, handleSubmit, form_data, user } = this.props;
    const avatar = user && user.profile && user.profile.avatar;

    return (
      <div className="container container--sm-width edit-profile">
        <h1 className="edit-profile__title">Edit Your profile</h1>
        <div className="edit-profile__subtitle">Upload your picture and tell us more about yourself.</div>
        <form className="edit-profile__form edit-form" onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="edit-form__grid">
            <ImageCropper
              key={avatar}
              avatar={avatar}
              ref={n => this._cropper = n}
              name="profile_attributes.avatar"
              className="edit-form__grid-item edit-form__grid-item--w-100"
              change={change}
              cropped_image={form_data && form_data.profile_attributes && form_data.profile_attributes.avatar}
              setNotifiaction={this.props.showNotification}
            />

            { /* <LoaderImage /> */}
            <div className="edit-form__grid-item edit-form__grid-item--w-50">
              <Field
                classNameInput="input"
                classNameLabel="post-form__label post-form__label--capitalize"
                disabled={submitting}
                name="first_name"
                type="text"
                component={renderInput}
                label="First name"
              />
            </div>
            <div className="edit-form__grid-item edit-form__grid-item--w-50">
              <Field
                classNameInput="input"
                classNameLabel="post-form__label"
                disabled={submitting}
                name="last_name"
                type="text"
                component={renderInput}
                label="Last Name (will not be visible)"
              />
            </div>
            <div className="edit-form__grid-item edit-form__grid-item--w-25 edit-form__grid-item--gender">
              <div className="post-form__label post-form__label--select-label">Gender</div>
              <div className="select-custom select-custom--full-width select-custom--edit">
                <Field
                  disabled={submitting}
                  name="profile_attributes.gender"
                  list={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]}
                  type="checkbox"
                  component={renderSelectbox}
                  defaultLabel="Select a role"
                  label="User Roles"
                />
              </div>
            </div>
            <div className="edit-form__grid-item edit-form__grid-item--w-25 edit-form__grid-item--hometown">
              <div className="post-form__label post-form__label--select-label">Age</div>
              <div className="select-custom select-custom--full-width select-custom--lg-h">
                <Field
                  classNameInput="input"
                  disabled={submitting}
                  name="profile_attributes.age"
                  component={renderInput}
                  type="text"
                  label="User Roles"
                  normalize={normalizeNumber}
                />
              </div>
            </div>
            <div className="edit-form__grid-item edit-form__grid-item--w-50">
              <Field
                classNameInput="input"
                classNameLabel="post-form__label post-form__label--capitalize"
                disabled={submitting}
                name="profile_attributes.hometown"
                type="text"
                component={renderInput}
                label="Hometown"
              />
            </div>
            <div className="edit-form__grid-item edit-form__grid-item--w-50">
              <Field
                classNameInput="input"
                classNameLabel="post-form__label post-form__label--capitalize"
                disabled={submitting}
                name="profile_attributes.university"
                type="text"
                component={renderInput}
                label="School"
              />
            </div>
            <div className="edit-form__grid-item edit-form__grid-item--w-100">
              <div className="form-group post-form__item">
                <Field
                  classNameLabel="post-form__label post-form__label--capitalize"
                  className="textarea--count textarea--description-profile"
                  disabled={submitting}
                  name="profile_attributes.about"
                  component={renderTextarea}
                  label="Description"
                  placeholder="What would you like tenants or roommates to know about your place?"
                  maxLength={2000}
                  row={8}
                />
              </div>
            </div>
          </div>
          <div className="edit-form__btn-groups">
            <Form.Button
              className="form-button--user-action form-button--default-dark"
              type="button"
              onClick={this.hanldeCancel}
              disabled={submitting}
            >
              <span>Cancel</span>
            </Form.Button>

            <Form.Button
              className={'form-button--user-action form-button--circle form-button--pink form-button--loader' + (submitting ? ' form-button--loading' : '')}
              disabled={submitting || pristine}
            >
              <span>Save</span>
            </Form.Button>
          </div>
        </form>
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
