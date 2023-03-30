import React, { PropTypes } from 'react';
import { Avatar } from 'elements';
import { Link } from 'react-router';

function Data(props) {
  const { name, location, avatar, userId, userProfileId, phone_confirmed, passport_confirmed } = props;

  return (
    <div className="profile-info">
      <Avatar className="avatar--large" img={avatar} />
      <div className="profile-data">
        <span className="profile__user-name">
          <span>{name}</span>
          {(phone_confirmed && passport_confirmed) && <span className="profile__user-bage"><i className="icon icon--blue_bage" /></span>}
        </span>
        <span className="profile__user-location">&mdash; {location}</span>
        {userId && userId === userProfileId &&
          <div className="profile__nav hidden-xs">
            <Link to="/profile/edit" className="form-button form-button--user-action form-button--default-dark">
              Edit
            </Link>
          </div>
        }
        {userId && userId === userProfileId &&
          <Link to="/profile/edit" className="visible-xs form-button--clear form-button--edit-profile">
            Edit profile
          </Link>
        }
      </div>
    </div>
  );
}
Data.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  avatar: PropTypes.string,
  userId: PropTypes.number,
  userProfileId: PropTypes.number,
  phone_confirmed: PropTypes.bool,
  passport_confirmed: PropTypes.bool,
};

export default Data;
