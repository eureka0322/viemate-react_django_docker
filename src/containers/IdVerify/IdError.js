import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { resultJumio } from 'redux/modules/profile';

@connect(() => ({}), {
  resultJumio
})
export default class IdError extends Component {
  static propTypes = {
    location: PropTypes.object,
    resultJumio: PropTypes.func,
  }

  componentDidMount() {
    const { location: {query} } = this.props;
    this.props.resultJumio({
      idScanStatus: query.idScanStatus,
      jumioIdScanReference: query.jumioIdScanReference,
      merchantIdScanReference: query.merchantIdScanReference,
      errorCode: query.errorCode,
    }).then(() => {
      this.jumioRedirect('failed');
    }, () => {
      this.jumioRedirect('failed');
    });
  }

  jumioRedirect(status) {
    if (window.top) {
      window.top.location.href = '/profile/settings?id_status=' + status;
    } else {
      window.location.href = '/profile/settings?id_status=' + status;
    }
  }

  render() {
    return null;
  }
}
