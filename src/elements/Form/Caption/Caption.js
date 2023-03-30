import React, { PropTypes } from 'react';

const Caption = ({ children, ...rest }) =>
  <div {...rest} className="caption">
    {children}
  </div>;

Caption.propTypes = {
  children: PropTypes.node
};

export default Caption;
