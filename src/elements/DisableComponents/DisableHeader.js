import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setFlag } from 'redux/modules/flags';

@connect(() => ({}), {
  setFlag
})
export default class DisableHeader extends Component {
  static propTypes = {
    setFlag: PropTypes.func,
  };

  componentWillMount() {
    this.props.setFlag('hide_header', true);
  }

  componentWillUnmount() {
    this.props.setFlag('hide_header', false);
  }

  render() {
    return null;
  }
}
