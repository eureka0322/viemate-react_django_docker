import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { PostHeader } from '.';
import { Form, ProgressBar } from 'elements';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import PostFormValidation from './PostFormValidation';
import { scrollToFirstError } from 'utils/helpers';
import constants from 'utils/constants';
import cx from 'classnames';

const renderInputHidden = field =>
  <Form.InputHidden
    field={field}
    {...field}
  />;

@connect(
  state => ({
    photo: formValueSelector('form-manage-post')(state, 'photo')
  })
)
@reduxForm({
  form: 'form-manage-post',
  validate: PostFormValidation,
  destroyOnUnmount: false,
  // enableReinitialize: true,
  touchOnBlur: false,
  onSubmitFail: (errors) => {
    scrollToFirstError(errors, 92);
  }
})
export default class PostFormPictures extends Component {
  static propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    change: PropTypes.func,
    productLoading: PropTypes.bool,
    progress: PropTypes.number,
    // submitting: PropTypes.bool.isRequired,
    photo: PropTypes.array
  };

  constructor() {
    super();
    this.state = {
      previewIndex: 0
    };
  }

  componentDidMount() {
    this.props.change('preview_index', this.state.previewIndex);
  }

  handleDelete(e, previewIndex = 0, delIndex = 0) {
    let arr = this.props.photo.filter((c, i) => i !== delIndex);

    if (delIndex <= previewIndex) {
      let index = previewIndex - 1;

      if (index < 0) index = 0;
      this.setState({ previewIndex: index });
      this.props.change('preview_index', index);
    }
    if (!arr.length) arr = null;
    this.props.change('photo', arr);

    e.stopPropagation();
  }

  handlePreview(previewIndex) {
    if (this.state.previewIndex !== previewIndex) {
      this.props.change('preview_index', previewIndex);
      this.setState({ previewIndex });
    }
  }

  render() {
    const { handleSubmit, error, previousPage, productLoading, photo, progress } = this.props;
    const { previewIndex } = this.state;

    const hasPhoto = photo && !!photo.length;
    const noPhoto = !photo || (photo && !photo.length);
    // console.log('PHOTO', photo);

    return (
      <div className="dropzone-container">
        <PostHeader className="icon--image" title="Pictures" subtitle="Pictures of the place are very important to our community." />
        <form className="post-form post-form__dropzone" action="" method="post" onSubmit={handleSubmit}>
          <div className={'post-form__dropzone-cover' + (hasPhoto ? ' post-form__dropzone-cover--has-img' : '')}>
            <Form.FileInput
              name="photo"
              classNameLabel="input-file input-file--label"
              className="input-file__container input-file__main"
              dropzone_options={{
                multiple: false,
                maxSize: constants.imgMaxSize,
                accept: 'image/*'
              }}
              replaceIndex={this.state.previewIndex + []}
            >
              {hasPhoto &&
                <div className="cover" style={{backgroundImage: `url(${photo[previewIndex].preview})`}} />}
              {noPhoto &&
                <span className="input-file input-file--default">
                  <i className="icon icon--upload" />
                  <span>Upload pictures</span>
                </span>}
              <div className="dropzone-container__panel-link dropzone-container__panel-link--title dropzone-container__panel-link--bottom">Cover image</div>
            </Form.FileInput>
            <div className="post-form__max-size">
              {`Max size is ${Math.round((constants.imgMaxSize / 1024 / 1024) * 100) / 100} Mb`}
            </div>
            {hasPhoto &&
              <button
                type="button"
                className="form-button form-button--extra-black form-button--delete-img form-button--around"
                onClick={e => this.handleDelete(e, previewIndex, previewIndex)}
              >
              <span>
                <i className="icon icon--delete-img" />
              </span>
            </button>}
          </div>
          <div className="post-form__dropzone-thumbs-title visible-xs">Others:</div>
          <div className="post-form__dropzone-thumbs">
            {hasPhoto &&
              photo.map((c, i) =>
                <div
                  key={i}
                  className={'dropzone-element dropzone-element--thumb' + (i === previewIndex ? ' dropzone-element--is-cover' : '')}
                  onClick={() => this.handlePreview(i)}
                >
                  <div className="dropzone-element__thumb-wrap" style={{backgroundImage: `url(${c.preview})`}} />
                  <button
                    type="button"
                    className="form-button form-button--extra-black form-button--delete-img form-button--around form-button--delete-thumb"
                    onClick={(e) => this.handleDelete(e, previewIndex, i)}
                  >
                    <i className="icon icon--delete-img" />
                  </button>
                </div>
              )}
            {(noPhoto || (photo && photo.length < constants.imgMaxItems)) &&
              <Form.FileInput
                name="photo"
                classNameLabel="input-file input-file--label"
                className="input-file__container input-file__add-more"
                dropzone_options={{
                  multiple: true,
                  accept: 'image/*',
                  maxSize: constants.imgMaxSize
                }}
                multipleFiles
                maxFiles={constants.imgMaxItems}
              >
                <span className="input-file input-file--more">
                  <i className="icon icon--plus" />
                  <span>Add more</span>
                </span>
              </Form.FileInput>}
          </div>
          <div className="post-form__section post-form__section--form-nav post-form__nav post-form__nav--step-4">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark"
              disabled={productLoading}
              onClick={previousPage}
              type="button"
            >
              <span>Back</span>
            </Form.Button>
            <Form.Button
              className={cx('form-button form-button--user-action form-button--circle form-button--pink form-button--loader form-button--progress', {
                'form-button--loading': productLoading,
                'form-button--uploaded': progress === 100
              })}
              disabled={productLoading}
              type="submit"
            >
              <span>Preview</span>
              <ProgressBar
                className="progress-bar--absolute"
                progress={progress}
                uploadedText="Processing"
                dots
              />
            </Form.Button>
            {error ? <Form.Alert title={error || ''} className="alert-danger" /> : null}
          </div>
        </form>
        <Field
          name="preview_index"
          type="hidden"
          component={renderInputHidden}
        />
      </div>

    );
  }
}
