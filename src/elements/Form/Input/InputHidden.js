import React, { PropTypes } from 'react';
import { Form } from 'elements';

const InputHidden = (props) => {
  const { field, type } = props;

  return (
    <div className="form-group">
      <input
        type={type}
        id={'form-input-' + field.input.name}
        {...field.input}
        onChange={field.input.onChange}
        style={{ display: 'none' }}
      />
      {field.meta.error && field.meta.touched && <Form.Error message={field.meta.error && field.meta.touched ? field.meta.error : ''} />}
    </div>
  );
};
InputHidden.propTypes = {
  field: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};
InputHidden.defaultProps = {
  className: '',
  type: 'hidden'
};
export default InputHidden;
