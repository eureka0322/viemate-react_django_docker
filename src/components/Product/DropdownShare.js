import React, { PropTypes } from 'react';
import { Dropdown, Form, Social } from 'elements';

const DropdownShare = ({ message, showEmailModal }) =>
  <div className="dropdown__share">
    <Dropdown
      className="dropdown--position-center dropdown--position-top dropdown--arrow dropdown--arrow-center dropdown--color-black dropdown--share-networks"
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
      <ul className="dropdown-menu dropdown-menu--share">
        {<li>
          <Social.FacebookMessengerButton message={message}>
            <i className="icon icon--facebook-messenger" />
            <span>Facebook messenger</span>
          </Social.FacebookMessengerButton>
        </li>}
        <li>
          <Social.FacebookButton message={message}>
            <i className="icon icon--facebook" />
            <span>Facebook Wall</span>
          </Social.FacebookButton>
        </li>
        <li>
          <Social.TwitterButton message={message}>
            <i className="icon icon--twitter" />
            <span>Twitter</span>
          </Social.TwitterButton>
        </li>
        <li>
          <button className="social_media_btn" onClick={showEmailModal}>
            <i className="icon icon--email" />
            <span>Email</span>
          </button>
        </li>
      </ul>
    </Dropdown>
  </div>;
DropdownShare.propTypes = {
  message: PropTypes.string,
  showEmailModal: PropTypes.func,
};

export default DropdownShare;
