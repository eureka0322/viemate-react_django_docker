import React, {PropTypes} from 'react';

/*eslint-disable*/
function fbShare(url, message) {
  if (FB) {
    FB.ui({
      method: 'share',
      href: url,
      quote: message
    });
  }
};
/*eslint-enable*/

export default function FacebookButton(props) {
  const url = window ? window.location.href : '';
  const { message, children } = props;
  return (
    <button className="social_media_btn" onClick={() => fbShare(url, message)}>
      {children}
    </button>
  );
}

FacebookButton.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node.isRequired,
};
