import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function PaymentsLinksMobile({ links, warnings }) {
  return (
    <div className="payments-links">
      <ul className="payments-links__list list-unstyled">
        {links.map((c, i) =>
          <li key={i} className="payments-links__item">
            <Link to={c.href} className="payments-links__link">
              {!!warnings.find(w => w === c.value) && <i className="icon icon--error-xs" />}
              {c.label}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
PaymentsLinksMobile.propTypes = {
  links: PropTypes.array,
  warnings: PropTypes.array
};

export default PaymentsLinksMobile;
