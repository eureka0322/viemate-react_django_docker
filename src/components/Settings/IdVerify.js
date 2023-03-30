import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

@connect(state => ({
  user: state.auth.user,
}), {})
export default class IdVerify extends Component {
  static propTypes = {
    user: PropTypes.object,
    // verifyId: PropTypes.func,
    // initializeJumio: PropTypes.func,
    // redux-form
  }

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      name: '',
    };
  }

  render() {
    const {user} = this.props;
    const id_verified = !!(user && user.profile) && user.profile.passport_confirmed;
    return (
      <div className="settings__wrapper">
        <div className="settings__item-form settings__item-form--flex-align">
          <div className="settings__title settings__title--new-space">Verify your ID</div>
          <p className="settings__description">{'If you plan to process payment, you\'ll need to provide a valid government ID. Verifying your ID is a reliable way to ensure that we build a trusted community. We work with one of the industry leaders in ID verification to verify users from more than 160 countries. You\'ll have the option to choose which form of ID to submit.'}</p>
        </div>
        { !id_verified &&
          <div className="settings__item-form settings__item-form--flex-align">
            <div className="settings__subtext settings__subtext--id">Upload your ID</div>
            <div className="settings__item-form--btn-verify settings__item-flex">
              <Link to="/profile/id_verification" className="form-button form-button form-button--setting-action form-button--circle form-button--md form-button--pink">Verify</Link>
            </div>
          </div>
        }
        {/* !id_verified && id_verifying &&
          <div className="settings__item-form settings__item-form--full-width">
            <div className="alert alert--success alert--md">
              <div className="alert__container">
                <div className="alert__container-wrapper">
                  <span className="alert__icon alert__icon--md alert__icon--success">
                    <i className="icon icon--success" />
                  </span>
                  <span className="alert__title alert__title--success">Your will receive verification status by email</span>
                </div>
              </div>
            </div>
          </div>
        */}
        { id_verified &&
          <div className="settings__item-form settings__item-form--flex-align">
            <div className="alert alert--success alert--md">
              <div className="alert__container">
                <div className="alert__container-wrapper">
                  <span className="alert__icon alert__icon--md alert__icon--success">
                    <i className="icon icon--success" />
                  </span>
                  <span className="alert__title alert__title--success">Your ID is verified</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
