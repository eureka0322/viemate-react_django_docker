import React, { PropTypes } from 'react';
import { Link as ReactLink } from 'react-router';
import { connect } from 'react-redux';

const formatUrl = (to, location) => {
  const chosen_location = location || '';

  return (
    { pathname: `${to.replace(/\{\{location\}\}/g, chosen_location)}`, query: to.query || null }
  );
};

const Link = ({ to, chosen_location, ...rest }) =>
  <ReactLink to={formatUrl(to, chosen_location)} {...rest} />;

Link.propTypes = {
  to: PropTypes.any,
  chosen_location: PropTypes.string,
};

export default connect(st => ({
  chosen_location: st.location.location,
}), {})(Link);
