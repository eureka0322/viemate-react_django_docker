import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from 'config';
import { Notifications } from 'components';
import { setBodyClassname } from 'utils/helpers';
import { loadNotifications } from 'redux/modules/profile';

@connect(st => ({
  notifications_loading: st.profile.notifications_loading,
  notifications: st.profile.notifications,
  notifications_meta: st.profile.notifications_meta,
}), {
  loadNotifications,
})
export default class NotificationsContainer extends Component {
  static propTypes = {
    loadNotifications: PropTypes.func,
    notifications_meta: PropTypes.object,
  }

  componentDidMount() {
    setBodyClassname('body-notifications');
    this.props.loadNotifications(30);
  }

  loadAll() {
    const {notifications_meta} = this.props;
    if (notifications_meta && notifications_meta.pagination) {
      this.props.loadNotifications(notifications_meta.pagination.total_objects);
    }
  }

  render() {
    return (
      <div className="setting-container">
        <Helmet {...config.app.head} />
        <div className="container container--md-width">
          <Notifications {...this.props} />
        </div>
      </div>
    );
  }
}
