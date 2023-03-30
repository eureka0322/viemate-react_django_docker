import React, { PropTypes, Component } from 'react';
import { Form } from 'elements';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { getCode, verifyCode, cancelCode } from 'redux/modules/profile';
import phoneValidation from './phoneValidation';
import phone_codes from 'libs/PhoneCodes/PhoneCodes';

const normalizePhone = code => (value) => {
  if (!value || value.slice(0, code.length) !== code) return code;
  return `${value[0].replace(/[^+\d]/g, '')}${value.slice(1).replace(/[^\d]/g, '')}`;
};

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

@connect(state => ({
  user: state.auth.user,
  code_sended: state.profile.code_sended,
  phone: state.profile.phone,
  // verifying: state.profile.verifying,
}), {
  getCode,
  verifyCode,
  cancelCode,
})
@reduxForm({
  form: 'verify_phone',
  validate: phoneValidation,
  touchOnBlur: false,
})
export default class PhoneVerify extends Component {
  static propTypes = {
    user: PropTypes.object,
    code_sended: PropTypes.bool,
    phone: PropTypes.string,
    // verifying: PropTypes.bool,
    getCode: PropTypes.func,
    verifyCode: PropTypes.func,
    cancelCode: PropTypes.func,
    // redux-form
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      phone_code: ''
    };
    this.selectCountry = ::this.selectCountry;
    this.verifyPhone = ::this.verifyPhone;
    this.verifyCode = ::this.verifyCode;
    this.moveToFirstStep = ::this.moveToFirstStep;
  }

  selectCountry(country) {
    if (country) {
      this.setState({ phone_code: country });
      this.props.change('phone', country);
    }
  }

  verifyPhone(data) {
    return this.props.getCode(data.phone).catch(() => {
      throw new SubmissionError({phone: 'Wrong number'});
    });
  }

  verifyCode(data) {
    return this.props.verifyCode(data.code).catch(() => {
      throw new SubmissionError({code: 'Wrong code'});
    });
  }

  moveToFirstStep() {
    this.props.cancelCode();
  }

  render() {
    const { phone_code } = this.state;
    const { submitting, handleSubmit, user, code_sended, phone, /*verifying*/ } = this.props;
    const phone_verified = !!(user && user.profile) && (user.profile.phone_confirmed || user.profile.phone_sms_confirmed); //phone_sms_confirmed is unneeded state and will be removed in future
    return (
      <div>
        <div className="settings__item-form settings__item-form--full-width">
          <div className="settings__title">Verify your phone number</div>
          <p className="settings__description">We take privacy and safety very seriously, and weeding out potential scammers and fraudsters is an integral part of our mission. To ensure this, please provide us your phone number. Not that we do not accept masked numbers such as Google Voice or Pinger.</p>
        </div>
        <div className="settings__item-form settings__item-form--full-width">
          { !phone_verified && !code_sended &&
            <div className="settings__form-wrapper">
              <div className="settings__inner-form">
                <div className="settings__label-form">Choose your country</div>
                <div className="select-custom select-custom--full-width select-custom--lg-h select-custom--country">
                  <Field
                    disabled={submitting}
                    name="country"
                    list={phone_codes}
                    type="checkbox"
                    component={renderSelectbox}
                    defaultLabel="Czech Republic"
                    label="User Roles"
                    searchable
                    cbFunction={val => this.selectCountry(val)}
                  />
                </div>
              </div>
              <div className="settings__inner-form settings__inner-form--input">
                <Field
                  classNameInput="form-control input input--default input--setting"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="phone"
                  type="phone"
                  label="Type your phone number"
                  component={renderInput}
                  normalize={normalizePhone(phone_code)}
                  placeholder=""
                />
              </div>
              <div className="settings__inner-form settings__inner-form--w-100">
                <Form.Button
                  className="form-button form-button--user-action form-button--circle form-button--pink form-button--md"
                  disabled={submitting}
                  type="button"
                  onClick={handleSubmit(this.verifyPhone)}
                >
                  <span>{'Send code'}</span>
                </Form.Button>
              </div>
            </div>
          }
          { !phone_verified && code_sended &&
            <div className="settings__form-wrapper">
              <div className="settings__inner-form settings__inner-form--subtext">
                <div className="settings__subtext">We’ve sent you SMS on Number:</div>
                <span className="settings__tel">{phone}</span>
              </div>
              <div className="settings__inner-form settings__inner-form--input-code">
                <Field
                  classNameInput="form-control input input--default input--setting"
                  classNameLabel="settings__label-form"
                  disabled={submitting}
                  name="code"
                  type="text"
                  label="Type verification code"
                  component={renderInput}
                  placeholder=""
                />
              </div>
              <Form.Button
                className="form-button form-button--user-action form-button--circle form-button--pink form-button--send-code"
                disabled={submitting}
                type="button"
                onClick={handleSubmit(this.verifyCode)}
              >
                <span>{'Send'}</span>
              </Form.Button>
              <Form.Button
                className="form-button form-button--setting-action form-button--default-dark form-button--code"
                disabled={submitting}
                type="button"
                onClick={this.moveToFirstStep}
              >
                <span>{'Send another code'}</span>
              </Form.Button>
            </div>
          }
          { phone_verified &&
            <div className="alert alert--success alert--md">
              <div className="alert__container">
                <div className="alert__container-wrapper">
                  <span className="alert__icon alert__icon--md alert__icon--success">
                    <i className="icon icon--success" />
                  </span>
                  <span className="alert__title alert__title--success">Your phone number is verified</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
