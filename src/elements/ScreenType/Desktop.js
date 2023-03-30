import {PropTypes} from 'react';
import { connect } from 'react-redux';

const ScreenDesktop = ({children, screen_type}) => {
  if (screen_type === 'desktop') {
    return children;
  }
  return null;
};

ScreenDesktop.propTypes = {
  children: PropTypes.node,
  screen_type: PropTypes.string,
};

export default connect(st => ({
  screen_type: st.screen_type.screen_type,
}), {})(ScreenDesktop);
