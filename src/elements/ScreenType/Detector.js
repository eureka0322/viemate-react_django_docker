import {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { setScreenResolution, setScreenType } from 'redux/modules/screen';
import { getWindowWidth } from 'utils/helpers';

@connect(() => ({}), {
  setScreenResolution,
  setScreenType
})
export default class ScreenDetector extends Component {
  static propTypes = {
    setScreenType: PropTypes.func,
    setScreenResolution: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.hanldeResize = ::this.hanldeResize;
  }

  componentDidMount() {
    this.hanldeResize();
    window.addEventListener('resize', this.hanldeResize);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    window.removeEventListener('resize', this.hanldeResize);
  }

  hanldeResize() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let w_width = getWindowWidth();
      w_width = w_width > 0 ? w_width : 1920;
      this.props.setScreenType(w_width);
      this.props.setScreenResolution(w_width);
    }, 100);
  }

  render() {
    return null;
  }
}
