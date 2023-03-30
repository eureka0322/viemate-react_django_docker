import React, { Component, PropTypes } from 'react';
import { ListApartment } from 'components';
import { connect } from 'react-redux';
import { load, clear, loadPosts } from 'redux/modules/profile';
import { Loader } from 'elements';
import Data from './Data';
import Description from './Description';
import Options from './Options';
import { addToFavorite, removeFavorite } from 'redux/modules/favorites';
import { truncateUserName } from 'utils/helpers';
import {} from './Profile.scss';
import {} from './ProfileVerified.scss';

@connect(
  state => ({
    loading: state.profile.loading,
    user: state.auth.user,
    user_profile: state.profile.profile,
    user_posts: state.profile.posts,
    wanted: state.favorites.wanted,
    offered: state.favorites.offered,
  }),
  {
    load,
    clear,
    loadPosts,
    addToFavorite,
    removeFavorite,
  }
)
export default class Profile extends Component {
  static propTypes = {
    user: PropTypes.object,
    user_profile: PropTypes.object,
    load: PropTypes.func,
    loadPosts: PropTypes.func,
    clear: PropTypes.func,
    paramsId: PropTypes.any, // router passes it as string
    profileId: PropTypes.number,
    loading: PropTypes.bool,
    user_posts: PropTypes.array,
    wanted: PropTypes.array,
    offered: PropTypes.array,
    addToFavorite: PropTypes.func,
    removeFavorite: PropTypes.func,
  };

  componentDidMount() {
    // for popup. from productS container
    const profileId = this.props.profileId;
    if (profileId) {
      this.props.load(profileId);
      this.props.loadPosts(profileId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.paramsId && !nextProps.paramsId) this.props.clear();
  }

  componentWillUnmount() {
    document.body.classList.remove('hide-scroll');
    this.props.clear();
  }

  genderSelector(gender) {
    switch (gender) {
      case 'male':
        return 'Male';
      case 'female':
        return 'Female';
      default:
        return '';
    }
  }

  bornSelector(age) {
    switch (age) {
      case 20:
        return 'In the 90s';
      case 30:
        return 'In the 80s';
      default:
        return '';
    }
  }

  checkPassport(user, id, passport) {
    if (user && Object.keys(user).length > 0 && passport && passport[0]) {
      if (!id || (parseFloat(user.id) === parseFloat(id)) || user.admin) {
        return passport[0].urls.original;
      }
    }
    return false;
  }

  render() {
    const user = this.props.user || {};
    const { user_profile, paramsId, profileId, user_posts, wanted, offered } = this.props;

    const hasId = !!(paramsId || profileId);
    const full_name = hasId ? user_profile.full_name : user.first_name;
    const first_name = truncateUserName(full_name, true);
    const passport = user.attachments;
    const profile_obj = (hasId ? user_profile : user.profile) || {};
    const { about, hometown, gender, age, avatar, university, phone_sms_confirmed, passport_confirmed } = profile_obj;

    if (this.props.loading) return <Loader />;

    return (
      <div className="profile-wrap">
        <div className="container--medium-xs-width container profile">
          <Data name={first_name} location={hometown} avatar={avatar} userId={user.id} userProfileId={user_profile.id || user.id} phone_confirmed={phone_sms_confirmed} passport_confirmed={passport_confirmed} />
          <Description text={about} />
          <Options gender={this.genderSelector(gender)} education={university} age={age} hometown={hometown} passport={this.checkPassport(user, (paramsId || profileId), passport)} profile={profile_obj} />
        </div>
        <div className="container container--separator container--separator-profile" />
        <div className="container--medium-width container">
          <ListApartment
            title={user_posts.length ? `CURRENT POSTS — ${user_posts.length}` : ''}
            products={user_posts}
            addToFavorite={this.props.addToFavorite}
            removeFavorite={this.props.removeFavorite}
            favorites={[...wanted, ...offered]}
            className="list-apartment list-apartment--profile"
            hidden_like
            hiddenAvatarLink
          />
          { /*<ListUser users={[]} /> */}
        </div>
      </div>
    );
  }
}
