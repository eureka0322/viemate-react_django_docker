import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setFlag } from 'redux/modules/flags';

@connect(() => ({}), {
  setFlag
})
export default class CurrentFilters extends Component {
  static propTypes = {
    setFlag: PropTypes.func,
  };

  componentWillMount() {
    this.props.setFlag('hide_current_filter', true);
  }

  componentWillUnmount() {
    this.props.setFlag('hide_current_filter', false);
  }

  render() {
    return null;
  }
}
