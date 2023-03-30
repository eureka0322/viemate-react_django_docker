import React, {PropTypes} from 'react';
// import { ShareButtons } from 'react-share';

/*eslint-disable*/
function fbMessage(url) {
  if (FB) {
    FB.ui({
      method: 'send',
      link: url,
    });
  }
};
/*eslint-enable*/

export default function FacebookMessengerButton(props) {
  const url = window ? window.location.href : '';
  const { children } = props;
  return (
    <button className="social_media_btn" onClick={() => fbMessage(url)}>
      {children}
    </button>
  );
}

FacebookMessengerButton.propTypes = {
  children: PropTypes.node.isRequired,
};
