import React, { Component, PropTypes } from 'react';
import {} from './PostForm.scss';
import PostFormBasics from './PostFormBasics';
import PostFormLocation from './PostFormLocation';
import PostFormTags from './PostFormTags';
import PostFormPictures from './PostFormPictures';

export default class PostForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    initialize: PropTypes.func,
    setAutocompleteState: PropTypes.func,
    page: PropTypes.number.isRequired,
    progress: PropTypes.number,
    productLoading: PropTypes.bool,
    custom_autocomplete: PropTypes.bool,
    nearby: PropTypes.array,
    friendly: PropTypes.array,
    included: PropTypes.array,
  };

  static defaultProps = {
    page: 1
  };

  // constructor() {
  //   super();
  //   this.state = {
  //     loaded: false
  //   };
  // }

  componentWillMount() {
    this.props.initialize({ furnished: '', gender: '' });
  }

  // componentDidMount() {
  //   this.setState({loaded: true}); // eslint-disable-line
  //   this.props.initialize({ furnished: 1 });
  // }

  render() {
    const {
      onSubmit,
      nextPage,
      previousPage,
      page,
      productLoading,
      custom_autocomplete,
      setAutocompleteState,
      included,
      friendly,
      nearby,
      progress
    } = this.props;
    // console.log('PRODUCT', this.props.product);

    return (
      <div>
        {page === 1 && // this.state.loaded &&
          <PostFormBasics onSubmit={nextPage} />}
        {page === 2 &&
          <PostFormLocation nearby={nearby} previousPage={previousPage} onSubmit={nextPage} custom_autocomplete={custom_autocomplete} setAutocompleteState={setAutocompleteState} />}
        {page === 3 &&
          <PostFormTags friendly={friendly} included={included} previousPage={previousPage} onSubmit={nextPage} />}
        {page === 4 &&
          <PostFormPictures previousPage={previousPage} onSubmit={onSubmit} productLoading={productLoading} progress={progress} />}
      </div>
    );
  }
}
