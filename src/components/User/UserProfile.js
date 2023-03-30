import React, { Component, PropTypes } from 'react';
import {} from './UserProfile.scss';
import { Avatar } from 'elements';
import { Link } from 'react-router';
import { truncateUserName } from 'utils/helpers';
import ProfileVerified from 'components/Profile/ProfileVerified';

export default class UserProfile extends Component {
  static propTypes = {
    description: PropTypes.string,
    name: PropTypes.string,
    img: PropTypes.any,
    id: PropTypes.number,
    profile: PropTypes.object,
  };

  render() {
    const { description, name, img, id, profile } = this.props;
    return (
      <div className="user-profile">
        <div className="user-profile__wrapper">
          <div className="avatar-wrapper avatar-wrapper--medium">
            <Link to={`/profile/${id}`}><Avatar img={img} /></Link>
          </div>
          <h1 className="user-profile__name">{truncateUserName(name, true)}
           {(profile.phone_sms_confirmed && profile.passport_confirmed) && <span className="user-profile__user-bage"><i className="icon icon--blue_bage" /></span>}
          </h1>
          <ProfileVerified profile={profile} />
          <div className="user-profile__description">{description}</div>
        </div>
      </div>
    );
  }
}
