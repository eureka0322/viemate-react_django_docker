import {PropTypes} from 'react';
import { connect } from 'react-redux';

const ScreenBreakpoints = ({children, screen_resolution, min, max}) => {
  if (screen_resolution >= min && screen_resolution < max) {
    return children;
  }
  return null;
};

ScreenBreakpoints.propTypes = {
  children: PropTypes.node,
  screen_resolution: PropTypes.number,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

ScreenBreakpoints.defaultProps = {
  min: 0,
  max: 9999999,
};

export default connect(st => ({
  screen_resolution: st.screen_type.screen_resolution,
}), {})(ScreenBreakpoints);
