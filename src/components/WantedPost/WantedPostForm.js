import React, { Component, PropTypes } from 'react';
import {} from './WantedPostForm.scss';
import WantedPostBasics from './WantedPostBasics';
import WantedPostTags from './WantedPostTags';

export default class WantedPostForm extends Component {
  static propTypes = {
    nextPage: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    productLoading: PropTypes.bool,
    locations: PropTypes.array,
    friendly: PropTypes.array,
    included: PropTypes.array,
    nearby: PropTypes.array,
  };

  static defaultProps = {
    page: 1
  };

  render() {
    const { page, nextPage, previousPage, onSubmit, productLoading, locations, friendly, included, nearby } = this.props;

    return (
      <div>
        {page === 1 && <WantedPostBasics onSubmit={nextPage} locations={locations} />}
        {page === 2 && <WantedPostTags nearby={nearby} included={included} friendly={friendly} previousPage={previousPage} onSubmit={onSubmit} productLoading={productLoading} />}
      </div>
    );
  }
}
