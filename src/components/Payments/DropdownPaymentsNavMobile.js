import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import { Dropdown } from 'elements';

const DropdownPaymentsNavMobile = ({selected, tabs}) =>
  <div className="payments-header__mob-dropdown">
    <Dropdown
      className="dropdown--position-left dropdown--color-white dropdown__setting dropdown--full-width dropdown--no-radius visible-xs"
      trigger={
        <button className="dropdown-toggle form-button form-button--clear form-button--setting-dropdown">
          <span>
            {selected}
            <i className="icon icon--setting" />
          </span>
        </button>
      }
      self_closing
    >
      <ul className="dropdown-menu dropdown-menu--setting-nav">
        {
          tabs.map((c, i) =>
            <li key={i}>
              <Link to={c.href} className="form-button form-button--clear form-button--setting-menu">{c.label}</Link>
            </li>
          )
        }
      </ul>
    </Dropdown>
  </div>;

DropdownPaymentsNavMobile.propTypes = {
  selected: PropTypes.string,
  tabs: PropTypes.array
};

export default DropdownPaymentsNavMobile;
