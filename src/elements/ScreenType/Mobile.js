import {PropTypes} from 'react';
import { connect } from 'react-redux';

const ScreenMobile = ({children, screen_type}) => {
  if (screen_type === 'mobile') {
    return children;
  }
  return null;
};

ScreenMobile.propTypes = {
  children: PropTypes.node,
  screen_type: PropTypes.string,
};

export default connect(st => ({
  screen_type: st.screen_type.screen_type,
}), {})(ScreenMobile);
