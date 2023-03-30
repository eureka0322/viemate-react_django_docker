import React, { PropTypes } from 'react';
import {} from './ProductProfile.scss';
import { Avatar, Form } from 'elements';
import { Link } from 'react-router';
import { truncString, truncateUserName } from 'utils/helpers';
import DropdownShare from './DropdownShare';
import ProfileVerified from 'components/Profile/ProfileVerified';

export default function ProductProfile(props) {
  const { openModal, productNavBtn } = props;
  const profile = props.profile || {};
  const about = truncString(profile.about, 100);

  return (
    <div className="product-profile">
      {profile &&
        <div className="product-profile__wrapper">
          <Link className="product-profile__avatar" to={`/profile/${profile.id}`}>
            <span className="avatar-wrapper avatar-wrapper--medium"><Avatar img={profile.avatar} /></span>
          </Link>
          <h2 className="product-profile__name">
           {truncateUserName(profile.full_name, true)}
           {(profile.phone_sms_confirmed && profile.passport_confirmed) && <span className="product-profile__user-bage"><i className="icon icon--blue_bage" /></span>}
          </h2>
          <ProfileVerified profile={profile} />
          {profile.about && <p className="product-profile__description">{about}</p>}
          {!productNavBtn ?
            <Form.Button
              className="form-button form-button--circle form-button--default-dark form-button--full-width form-button--message"
              onClick={openModal}
              disabled={false}
              type="button"
            >
              <span>Message</span>
            </Form.Button> : productNavBtn}
        </div>
      }
      {profile && props.ownPost &&
      <div className="product-profile__share">
        <div className="form-button-group action__btn-group">
          <DropdownShare showEmailModal={() => props.showModal('email_modal_is_opened')} message={props.message} />
        </div>
      </div>}
    </div>
  );
}

ProductProfile.propTypes = {
  profile: PropTypes.object,
  openModal: PropTypes.func,
  showModal: PropTypes.func,
  message: PropTypes.string,
  productNavBtn: PropTypes.node,
  ownPost: PropTypes.bool
};
