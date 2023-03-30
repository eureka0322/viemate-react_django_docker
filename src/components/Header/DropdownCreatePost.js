import React from 'react';
import { Link } from 'react-router';
import { Dropdown } from 'elements';

const DropdownCreatePost = () =>
  <div className="">
    <Dropdown
      className="dropdown--position-center dropdown--arrow dropdown--arrow-center dropdown--create-post dropdown--color-black"
      trigger={
        <button className="dropdown-toggle form-button form-button--pink form-button--header-create-post form-button--create header__button-registered">
          <span>
            Create a post
          </span>
        </button>
      }
      self_closing
    >
      <ul className="dropdown-menu dropdown-menu--create-post-list">
        <li>
          <Link to="/offered-post" className="form-button form-button--base-grey">I have a place</Link>
        </li>
        <li>
          <Link to="/wanted-post" className="form-button form-button--base-grey">I want a place</Link>
        </li>
      </ul>
    </Dropdown>
  </div>;

export default DropdownCreatePost;
