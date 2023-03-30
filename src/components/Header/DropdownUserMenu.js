import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Dropdown, Avatar } from 'elements';

const DropdownUserMenu = ({ logOut, img }) =>
  <div className="">
    <Dropdown
      className="dropdown--position-center dropdown--position-top dropdown--arrow dropdown--arrow-center dropdown--color-black dropdown dropdown__header-user-menu dropdown--header"
      trigger={
        <button className="dropdown-toggle form-button form-button--clear form-button--header-dropdown-user">
          <span className="avatar-wrapper avatar-wrapper--extra-xs">
            <Avatar img={img} />
          </span>
        </button>
      }
      self_closing
    >
      <ul className="dropdown-menu dropdown-menu--user-memu">
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/profile/settings">Setting</Link>
        </li>
        <li>
          <Link to="/profile/payments">Rental Requests & Payment</Link>
        </li>
        <li>
          <Link to="/profile/manage-posts">Manage posts</Link>
        </li>
        <li>
          <a href="/" onClick={(e) => { e.preventDefault(); logOut(); }}>Sign out</a>
        </li>
      </ul>
    </Dropdown>
  </div>;
DropdownUserMenu.propTypes = {
  logOut: PropTypes.func,
  img: PropTypes.any,
};

export default DropdownUserMenu;
