import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from 'config';
import { Profile as ProfileComponent } from 'components';
import { setBodyClassname } from 'utils/helpers';
import { load, loadPosts } from 'redux/modules/profile'; // eslint-disable-line

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();

    if (params.id/* && !state.profile.loaded*/) {
      promises.push(dispatch(load(params.id)));
      promises.push(dispatch(loadPosts(params.id)));
    }
    if (!params.id/* && !state.profile.loaded_posts*/) {
      promises.push(dispatch(loadPosts(state.auth.user.id)));
    }

    return Promise.all(promises);
  }
}])
export default class Profile extends Component {
  static propTypes = {
    params: PropTypes.object
  }

  componentDidMount() {
    setBodyClassname('body-profile');
  }

  render() {
    return (
      <div>
        <Helmet {...config.app.head} />
        <ProfileComponent paramsId={this.props.params.id} />
      </div>
    );
  }
}
