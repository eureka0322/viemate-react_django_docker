import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setFlag } from 'redux/modules/flags';

@connect(() => ({}), {
  setFlag
})
export default class DisableFooter extends Component {
  static propTypes = {
    setFlag: PropTypes.func,
  };

  componentWillMount() {
    this.props.setFlag('hide_footer', true);
  }

  componentWillUnmount() {
    this.props.setFlag('hide_footer', false);
  }

  render() {
    return null;
  }
}
