import {PropTypes} from 'react';
import { connect } from 'react-redux';

const ScreenTabletMax = ({children, screen_type}) => {
  if (screen_type === 'mobile' || screen_type === 'tablet') {
    return children;
  }
  return null;
};

ScreenTabletMax.propTypes = {
  children: PropTypes.node,
  screen_type: PropTypes.string,
};

export default connect(st => ({
  screen_type: st.screen_type.screen_type,
}), {})(ScreenTabletMax);
