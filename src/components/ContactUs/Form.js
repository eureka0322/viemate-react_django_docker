import React, {PropTypes} from 'react';
import { Form } from 'elements';
import { Field } from 'redux-form';

const renderTextarea = (field) =>
  <Form.Textarea
    {...field}
    field={field}
  />;

const ContactForm = (props) => {
  const {submitting, pristine, handleSubmit, error, sending} = props;

  return (
    <form onSubmit={handleSubmit} className="info-box__form">
      <Field
        className="textarea--contact-us"
        classNameLabel="info-box__label"
        component={renderTextarea}
        label={'Or fill out below form:'}
        row={7}
        name={'message'}
        placeholder="Please tell us how we can help you?"
      />
      <Form.Button
        className="form-button form-button--pink form-button--circle form-button--send-sm"
        type="submit"
        disabled={submitting || pristine || sending}
      >
        Send
      </Form.Button>
      {error && <Form.Error message={error} />}
    </form>
  );
};

ContactForm.propTypes = {
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  handleSubmit: PropTypes.func,
  sending: PropTypes.bool,
  error: PropTypes.string,
};

export default ContactForm;
