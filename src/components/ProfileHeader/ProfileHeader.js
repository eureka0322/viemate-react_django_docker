import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';

const tabs = (has_warn) => ([
  {label: 'Settings', href: '/profile/settings', regexp: /\/profile\/settings/},
  {label: 'Payments & Rental Requests', href: '/profile/payments', regexp: /\/profile\/payments/, is_new: has_warn},
  {label: 'Manage posts', href: '/profile/manage-posts', regexp: /\/profile\/manage-posts/},
]);

const ProfileHeader = ({location, payments}) => {
  const tabs_arr = tabs(!payments.find(c => !!c.default));
  return (
    <div className="container container--full-width">
      <ul className="settings__nav list-unstyled">
        {
          tabs_arr.map((c, i) => {
            if (c.disabled) {
              return (
                <li key={i} className={classNames('settings__nav-item settings__nav-item--disabled', `settings__nav-item--count-${tabs_arr.length}`, {'settings__nav-item--is_new': c.is_new})}>
                  <div className={classNames('form-button form-button--clear form-button--setting-menu', {'is-active': c.regexp.test(location.pathname)})}>
                    <span>{c.label}</span>
                  </div>
                </li>
              );
            }
            return (
              <li key={i} className={classNames('settings__nav-item', `settings__nav-item--count-${tabs_arr.length}`, {'settings__nav-item--is_new': c.is_new})}>
                <Link to={c.href} className={classNames('form-button form-button--clear form-button--setting-menu', {'is-active': c.regexp.test(location.pathname)})}>
                  <span>{c.label}</span>
                </Link>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

ProfileHeader.propTypes = {
  location: PropTypes.object,
  payments: PropTypes.array,
};

export default connect(state => ({
  location: state.routing.locationBeforeTransitions,
  payments: state.payments.payment_methods,
}), {})(ProfileHeader);
