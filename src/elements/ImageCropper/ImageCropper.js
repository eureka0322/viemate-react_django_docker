import React, { Component, PropTypes } from 'react';
import { Form, Avatar, LoaderImage } from 'elements';
import { Field } from 'redux-form';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import ReactInputRange from 'react-input-range';

const renderInputHidden = field =>
  <Form.InputHidden
    field={field}
    {...field}
  />;

export default class ImageCropper extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    change: PropTypes.func,
    setNotifiaction: PropTypes.func,
    cropped_image: PropTypes.string,
    avatar: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    setNotifiaction: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      range: 0,
      scale: 1,
      loading: false,
      progress: 0,
    };
    // this.fr = new FileReader();
    this.handleDrop = ::this.handleDrop;
    this.handleUploadAnother = ::this.handleUploadAnother;
    this.handleRangeChange = ::this.handleRangeChange;
    this.saveImage = ::this.saveImage;
    this.editImage = ::this.editImage;
    this.saveImageAsDataURI = ::this.saveImageAsDataURI;
  }

  componentDidMount() {
    this.fr = new FileReader();
    if (this.fr) {
      this.fr.addEventListener('load', () => {
        this.saveImageAsDataURI(this.fr.result);
      }, false);
      this.fr.addEventListener('loadstart', () => {
        this.setState({loading: true});
      });
      this.fr.addEventListener('progress', (e) => {
        this.setState({progress: (e.loaded / e.total) * 100});
      });
      this.fr.addEventListener('loadend', () => {
        setTimeout(() => this.setState({loading: false, progress: 0}), 500);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cropped_image && !nextProps.cropped_image) {
      this.setState({ image: null });
    }
  }

  componentWillUnmount() {
    if (this.fr) {
      this.fr.removeEventListener('load', () => {
        this.saveImageAsDataURI(this.fr.result);
      }, false);
      this.fr.removeEventListener('loadstart', () => {
        this.setState({loading: true});
      });
      this.fr.removeEventListener('progress', (e) => {
        this.setState({progress: (e.loaded / e.total) * 100});
      });
      this.fr.removeEventListener('loadend', () => {
        setTimeout(() => this.setState({loading: false, progress: 0}), 500);
      });
    }
  }

  saveImageAsDataURI(source) {
    const img = new Image();
    img.src = source;
    img.addEventListener('load', () => {
      if (img.width > 362 && img.height > 362) {
        this.setState({
          image: source,
          range: 0,
          scale: 1,
        });
      } else {
        this.props.setNotifiaction('image_size', {text: 'Image resolution should be bigger than 362x362', type: 'error'});
      }
    }, false);
    // this.setState({
    //   image: img,
    //   range: 0,
    //   scale: 1,
    // });
  }

  handleDrop(f) {
    if (this.fr) {
      this.fr.readAsDataURL(f[0]);
    }
  }

  handleUploadAnother() {
    this._dropzone.open();
  }

  handleRangeChange(c, v) {
    this.setState({
      range: v,
      scale: 1 + (v / 50),
    });
  }

  saveImage() {
    if (this._avatar) {
      const image = this._avatar.getImageScaledToCanvas().toDataURL();
      this.props.change(this.props.name, image);
    }
  }

  editImage() {
    this.setState({ image: null, range: 0, scale: 1 });
    this.props.change(this.props.name, null);
  }

  render() {
    const { name, className, avatar } = this.props;
    const { image, scale, range, loading, progress } = this.state;
    return (
      <div className={className} ref={n => this._wrapper = n}>
        <div className="input-file input-file__container input-file__avatar input-file--full-width settings__label-form settings__label-form--input-file">
          <Dropzone
            multiple={false}
            accept={'image/*'}
            onDrop={(f) => this.handleDrop(f)}
            className="dropzone-element"
            name={'crop_____dropzone'}
            style={(image || avatar) ? {display: 'none'} : {}}
            ref={n => this._dropzone = n}
          >
            <span className="input-file input-file--more">
              <i className="icon icon--plus" />
              <span>Select-file</span>
            </span>
          </Dropzone>
          {!image && !!avatar &&
            <Avatar img={avatar} overlay className="avatar--large" onClick={this.handleUploadAnother} />
          }
          {!!image &&
            <div className="react-crop__container">
              <div className="react-crop__container-wrap">
                <AvatarEditor
                  ref={n => this._avatar = n}
                  image={image}
                  width={362}
                  height={362}
                  border={50}
                  borderRadius={362}
                  color={[0, 0, 0, 0.6]} // RGBA
                  scale={scale}
                  style={{width: '100%'}}
                  onMouseUp={this.saveImage}
                  onImageReady={this.saveImage}
                />
              </div>

              <ReactInputRange
                maxValue={100}
                minValue={0}
                value={range}
                onChange={this.handleRangeChange}
                onChangeComplete={this.saveImage}
              />
              <div className="btn-groups">
                <button type="button" onClick={this.handleUploadAnother} className="form-button form-button--circle form-button--pink form-button--user-action" ><span>Upload another</span></button>
              </div>

            </div>
          }
          {/*!!image && !cropped_image &&
            <div className="" style={{maxWidth: '49%', display: 'inline-block'}}>
              <canvas ref={n => this._canvas = n} style={{maxWidth: '100%'}} />
              <button type="button" onClick={this.saveImage}>Save</button>
            </div>
          */}
          {/*!!cropped_image &&
            <div className="react-crop__avatar">
              <img src={cropped_image} alt="avatar" style={{maxWidth: '100%'}} />
              <div className="btn-groups">
                <button type="button" className="form-button form-button--circle form-button--default-dark form-button--user-action" onClick={this.editImage}>Remove</button>
              </div>
            </div>
          */}
        </div>
        <Field
          name={name}
          type="hidden"
          component={renderInputHidden}
        />
        {loading && <LoaderImage progress={progress} />}
      </div>
    );
  }
}
