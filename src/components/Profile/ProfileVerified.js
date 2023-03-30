import React from 'react';

function ProfileVerified({ profile }) {
  return (
    <div className="profile__verified">
      <span className="profile__verified-text">VERIFIED BY</span>
      <ul className="list-unstyled profile__verified-list">
        {profile.passport_confirmed &&
          <li className="profile__verified-item profile__verified-item--verified">
            <span className="icon-font icon-font-icon-gov_id profile__verified-item--icon_passport" />
            <span className="profile__verified-item--text">Gov ID</span>
          </li>
        }
        {profile.phone_sms_confirmed &&
          <li className="profile__verified-item profile__verified-item--verified">
            <span className="icon-font icon-font-icon-mobile profile__verified-item--icon_phone" />
            <span className="profile__verified-item--text">Mobile</span>
          </li>
        }
        {(!profile.phone_sms_confirmed && !profile.passport_confirmed) &&
          <li className="profile__verified-item profile__verified-item--non-verified">
            <span className="profile__verified-item--text">Not verified yet</span>
          </li>
        }
      </ul>
    </div>
  );
}
ProfileVerified.propTypes = {
  profile: React.PropTypes.object.isRequired
};

export default ProfileVerified;
