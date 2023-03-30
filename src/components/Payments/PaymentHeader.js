import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';
import DropdownPaymentsNavMobile from './DropdownPaymentsNavMobile.js';

function selected(link, arr, location) {
  const current = arr.find(c => c.href === location.pathname);
  if (current) {
    return current.label;
  }
  return arr[0].label;
}

const PaymentHeader = ({ tabs, current, warnings, screen_type, location }) => {
  if (current && screen_type === 'mobile') {
    return (
      <div className="payments-header">
        <DropdownPaymentsNavMobile selected={selected(location.pathname, tabs, location)} tabs={tabs} />
        <span className="payments-header__mob-descr">Payment options are used to process rent transactions</span>
      </div>
    );
  } else if (screen_type === 'mobile') return null;

  return (
    <div className="react-tabs">
      <ul className="react-tabs-list">
        {tabs.map((c, i) =>
          <li key={i} className={classNames('react-tab', {'react-tab--selected': (c.value === current) || (!current && i === 0)})}>
            <Link to={`/profile/payments/${c.value}`}>
              {!!warnings.find(w => w === c.value) && <i className="icon icon--error-xs" />}
              {c.label}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

PaymentHeader.propTypes = {
  tabs: PropTypes.array,
  warnings: PropTypes.array,
  current: PropTypes.string,
  screen_type: PropTypes.string,
  location: PropTypes.object,
};

PaymentHeader.defaultProps = {
  tabs: [],
  warnings: []
};

export default PaymentHeader;
