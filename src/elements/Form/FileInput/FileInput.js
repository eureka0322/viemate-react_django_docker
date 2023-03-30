import React, {Component, PropTypes} from 'react'; // eslint-disable-line
import Dropzone from 'react-dropzone';
import { Form } from 'elements';
import {} from './FileInput.scss';
import { Field } from 'redux-form';

class FileInput extends Component {
  static propTypes = {
    dropzone_options: PropTypes.object,
    meta: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    classNameLabel: PropTypes.string,
    className: PropTypes.string,
    replaceIndex: PropTypes.string,
    error_hidden: PropTypes.bool,
    multipleFiles: PropTypes.bool,
    children: PropTypes.node,
    cbFunction: PropTypes.func,
    maxFiles: PropTypes.number
  };

  static defaultProps = {
    className: '',
    cbFunction: () => {}
  };

  constructor() {
    super();
    this.replacedFile = null;
  }

  handleFiles(f, value) {
    if (this.props.multipleFiles) { // for multiple files
      const { maxFiles } = this.props;

      value = value ? value.concat(f) : f;
      if (maxFiles && value.length > maxFiles) value.length = maxFiles;
      return value;
    }
    if (this.props.replaceIndex) { // for single file
      const replaceIndex = +this.props.replaceIndex;
      this.replacedFile = null;

      value = (value && value.length)
        ? value.map((c, i) => {
          if (i === replaceIndex && f.length) {
            this.replacedFile = value[i];
            return f[0];
          }
          return c;
        })
        : f;
      return value;
    }

    return f;
  }

  render() {
    const { className, input: { onChange, value }, dropzone_options, meta: { error, touched }, error_hidden, label, classNameLabel, children, name, cbFunction } = this.props; //eslint-disable-line

    return (
      <div className={`input-file ${className}` + (error && touched ? ' has-error ' : '')}>
        {label && <p className={classNameLabel || ''}>{label}</p>}
        <Dropzone
          {...dropzone_options}
          onDrop={(f) => {
            const files = this.handleFiles(f, value);
            cbFunction(f, files, this.replacedFile);
            return onChange(files);
          }}
          className="dropzone-element"
          name={name}
        >
          {children}
        </Dropzone>
        {!error_hidden && error && <Form.Error message={error && touched ? error : ''} />}
      </div>
    );
  }
}
export default props => <Field {...props} component={FileInput} />;
