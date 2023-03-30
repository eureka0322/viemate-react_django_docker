import React from 'react';

function Description({ text }) {
  return (
    <p className="profile-description">{text}</p>
  );
}
Description.propTypes = {
  text: React.PropTypes.string
};

export default Description;
