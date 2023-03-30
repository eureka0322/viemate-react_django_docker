import React, { PropTypes } from 'react';
import ProfileVerified from './ProfileVerified';

function Options(props) {
  const { age, education, gender, hometown, profile } = props;

  return (
    <ul className="list-unstyled profile-options">
      <li className="profile-options__item">
        <span className="profile-options__title">Gender</span>
        <span className="profile-options__option">{gender}</span>
      </li>
      <li className="profile-options__item">
        <span className="profile-options__title">Age</span>
        <span className="profile-options__option">{age}</span>
      </li>
      <li className="profile-options__item">
        <span className="profile-options__title">School</span>
        <span className="profile-options__option">{education}</span>
      </li>
      <li className="profile-options__item">
        <span className="profile-options__title">Hometown</span>
        <span className="profile-options__option">{hometown}</span>
      </li>
      <li className="profile-options__item profile-options__item--verified">
        <ProfileVerified profile={profile} />
      </li>
    </ul>
  );
}
Options.propTypes = {
  gender: PropTypes.string,
  education: PropTypes.string,
  hometown: PropTypes.string,
  age: PropTypes.number,
  profile: PropTypes.object
};

export default Options;
