import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { ProfileHeader, SettingHeader, Settings as SettingsComponent } from 'components';
import {} from './Settings.scss';
import { setBodyClassname } from 'utils/helpers';
import { loadPayments, loadPayout } from 'redux/modules/payments';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { showDefault } from 'redux/modules/notifications';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();
    if (!state.payments.payments_loaded) {
      promises.push(dispatch(loadPayments()));
    }
    if (!state.payments.payout_loaded) {
      promises.push(dispatch(loadPayout()));
    }
    return Promise.all(promises);
  }
}])
@connect(() => ({}), {
  showDefault,
  replace
})
export default class Settings extends Component {
  static propTypes = {
    location: PropTypes.object,
    showDefault: PropTypes.func,
    replace: PropTypes.func,
  };

  componentDidMount() {
    const { location: { query: { id_status } } } = this.props;
    setBodyClassname('body-settings');
    if (id_status) {
      if (id_status === 'success') {
        this.props.showDefault('id_success');
        this.props.replace('/profile/settings');
      } else if (id_status === 'failed') {
        this.props.showDefault('id_failed');
        this.props.replace('/profile/settings');
      }
    }
  }

  render() {
    return (
      <div className="settings-container">
        <Helmet {...config.app.head} />
        <ProfileHeader {...this.props} />
        <div className="container container--md-width">
          <SettingHeader title="Settings" subtitle="Here you can change your password, verify your phone and ID." />
          <SettingsComponent />
        </div>
      </div>
    );
  }
}
