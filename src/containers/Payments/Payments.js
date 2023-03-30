import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from 'config';
import { ProfileHeader, SettingHeader, Payments as PaymentsComponent } from 'components';
import { setBodyClassname } from 'utils/helpers';
import { loadPayments, loadPayout } from 'redux/modules/payments';
import { asyncConnect } from 'redux-connect';
import { DisableComponent } from 'elements';

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
@connect(st => ({
  screen_type: st.screen_type.screen_type
}), {})
export default class Payments extends Component {
  static propTypes = {
    screen_type: PropTypes.string
  };

  componentDidMount() {
    setBodyClassname('body-settings');
  }

  render() {
    const { screen_type } = this.props;
    const title = screen_type !== 'mobile' ? 'Payments & Rental Requests' : <span>Payments and<br />Rental Requests</span>;
    const subtitle = screen_type !== 'mobile' ? 'Payment options are used to process rent transactions' : null;

    return (
      <div className="setting-container">
        <DisableComponent.Footer />
        <Helmet {...config.app.head} script={[{src: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js', type: 'text/javascript'}]} />
        <ProfileHeader {...this.props} />
        <div className="container container--large-md-width container--xs-full-width">
          <SettingHeader title={title} subtitle={subtitle} className="setting-header--payments" />
          <PaymentsComponent {...this.props} />
        </div>
      </div>
    );
  }
}
