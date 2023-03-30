import React from 'react';
import { Link } from 'react-router';
import { Dropdown, Form } from 'elements';

const DropdownShare = () =>
  <div className="dropdown__share">
    <Dropdown
      className="dropdown--position-center dropdown--position-top dropdown--arrow dropdown--arrow-center dropdown--color-black dropdown"
      trigger={
        <Form.Button
          className="form-button--clear"
          onClick={() => {}}
          disabled={false}
          type="button"
        >
          <span>
            <i className="icon icon--share" />
            <span>Share</span>
          </span>
        </Form.Button>
      }
      self_closing
    >
      <ul className="dropdown-menu">
        <li>
          <Link to="/">
            <i className="icon icon--facebook-messenger" />
            Facebook messenger
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="icon icon--facebook" />
            Facebook wall
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="icon icon--twitter" />
            Twitter
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="icon icon--email" />
            Email
          </Link>
        </li>
      </ul>
    </Dropdown>
  </div>;

export default DropdownShare;
