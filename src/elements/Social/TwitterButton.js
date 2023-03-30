import React, {PropTypes} from 'react';
// import { ShareButtons } from 'react-share';
import { truncString } from 'utils/helpers';

/*eslint-disable*/
function tweetMessage(url, message) {
  if (window) {
    const string = truncString(message, 140 - (url.length + 4), '...');
    const text = encodeURI(`${string}\n${url}`);
    const width = 575;
    const height = 400;
    const opts = `status=1,
                  width=${width}
                  height=${height}`;

    window.open(`https://twitter.com/intent/tweet?text=${text}`, 'twitter', opts);
  }
};
/*eslint-enable*/

export default function TwitterButton(props) {
  const url = window ? window.location.href : '';
  const { message, children } = props;
  return (
    <button className="social_media_btn" onClick={() => tweetMessage(url, message)}>
      {children}
    </button>
  );
}

TwitterButton.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node.isRequired,
};
