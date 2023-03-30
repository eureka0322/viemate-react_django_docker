import {PropTypes} from 'react';
import { connect } from 'react-redux';

const ScreenTabletMin = ({children, screen_type}) => {
  if (screen_type === 'desktop' || screen_type === 'tablet') {
    return children;
  }
  return null;
};

ScreenTabletMin.propTypes = {
  children: PropTypes.node,
  screen_type: PropTypes.string,
};

export default connect(st => ({
  screen_type: st.screen_type.screen_type,
}), {})(ScreenTabletMin);
