import React, {PropTypes} from 'react';
import { Dropdown } from 'elements';

const DropdownPaymentSetting = ({setAsDefault, removeCard, is_default}) =>
  <div className="">
    <Dropdown
      className="dropdown dropdown--position-right dropdown--arrow dropdown--arrow-right dropdown--color-black dropdown__payments"
      trigger={
        <button className="dropdown-toggle form-button form-button--clear" type="button">
          <span>
            <i className="icon icon--setting-default" />
          </span>
        </button>
      }
      self_closing
    >
      <ul className="dropdown-menu">
        {!is_default &&
          <li>
            <button onClick={setAsDefault} className="form-button form-button--clear">Set as default</button>
          </li>
        }
        <li>
          <button onClick={removeCard} className="form-button form-button--clear">Remove</button>
        </li>
      </ul>
    </Dropdown>
  </div>;

DropdownPaymentSetting.propTypes = {
  setAsDefault: PropTypes.func.isRequired,
  removeCard: PropTypes.func.isRequired,
  is_default: PropTypes.bool,
};

DropdownPaymentSetting.defaultProps = {
  setAsDefault: () => {},
  removeCard: () => {},
};

export default DropdownPaymentSetting;
