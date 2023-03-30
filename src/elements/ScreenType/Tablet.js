import {PropTypes} from 'react';
import { connect } from 'react-redux';

const ScreenTablet = ({children, screen_type}) => {
  if (screen_type === 'tablet') {
    return children;
  }
  return null;
};

ScreenTablet.propTypes = {
  children: PropTypes.node,
  screen_type: PropTypes.string,
};

export default connect(st => ({
  screen_type: st.screen_type.screen_type,
}), {})(ScreenTablet);
