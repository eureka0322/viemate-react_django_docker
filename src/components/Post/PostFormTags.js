import React, { Component, PropTypes } from 'react';
import { PostHeader } from '.';
import { Form } from 'elements';
import { reduxForm, Field } from 'redux-form';
import PostFormValidation from './PostFormValidation';
import { scrollToFirstError } from 'utils/helpers';

const renderCheckbox = field =>
  <Form.Checkbox
    field={field}
    {...field}
  />;

// const renderInput = field =>
//   <Form.Input
//     field={field}
//     {...field}
//   />;

@reduxForm({
  form: 'form-manage-post',
  validate: PostFormValidation,
  destroyOnUnmount: false,
  // enableReinitialize: true,
  onSubmitFail: (errors) => {
    scrollToFirstError(errors, 92);
  }
})
export default class PostFormTags extends Component {
  static propTypes = {
    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    error: PropTypes.string,
    // errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    // pristine: PropTypes.bool.isRequired,
    previousPage: PropTypes.func.isRequired,
    // reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    // valid: PropTypes.bool.isRequired,
    // tags
    friendly: PropTypes.array,
    included: PropTypes.array,
  };

  render() {
    const { handleSubmit, error, previousPage, submitting, friendly, included } = this.props;

    return (
      <div className="post-body__container-tags">
        <PostHeader className="icon--heart-tag" title="More tags about your place" subtitle="These tags help people when they search for places." />
        <form className="post-form post-form__container-tags" action="" method="post" onSubmit={handleSubmit}>
          {friendly &&
            <div className="post-form__section post-form__section--tags-container">
              <div className="post-form__label post-form__label--label-checkbox-tags">Friendly</div>
              <div className="post-form__container">
                <ul className="list-unstyled post-form__checkbox-lists">
                {friendly.map((c, i) =>
                  <li key={i}>
                    <Field
                      classNameLabel="form-checkbox__label form-checkbox__label--tag"
                      disabled={submitting}
                      name={`${c.name}`}
                      type="checkbox"
                      component={renderCheckbox}
                      label={`${c.name}`}
                    />
                  </li>
                )}
                  {/*<li>
                    <Form.Button
                      className="form-button form-button--light-grey"
                      type="button"
                    >
                      <span>Show next +30 tags</span>
                    </Form.Button>
                  </li>*/}
                </ul>
              </div>
            </div>
          }
          {included &&
            <div className="post-form__section post-form__section--tags-container post-form__section--tags-inluded">
              <div className="post-form__label post-form__label--label-checkbox-tags">Included in the rent</div>
              <div className="post-form__container">
                <ul className="list-unstyled post-form__checkbox-lists">
                {included.map((c, i) =>
                  <li key={i}>
                    <Field
                      classNameLabel="form-checkbox__label form-checkbox__label--tag"
                      disabled={submitting}
                      name={`${c.name}`}
                      type="checkbox"
                      component={renderCheckbox}
                      label={`${c.name}`}
                    />
                  </li>
                )}
                  {/*<li>
                    <Form.Button
                      className="form-button form-button--light-grey"
                      type="button"
                    >
                      <span>Show next +30 tags</span>
                    </Form.Button>
                  </li>*/}
                </ul>
              </div>
            </div>
          }
          <div className="post-form__section post-form__section--form-nav post-form__nav post-form__nav--step-3">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark"
              disabled={submitting}
              onClick={previousPage}
              type="button"
            >
              <span>Back</span>
            </Form.Button>

            <Form.Button
              className="form-button form-button--user-action form-button--circle form-button--pink"
              disabled={submitting}
              type="submit"
            >
              <span>Next</span>
            </Form.Button>

            {error ? <Form.Alert title={error || ''} className="alert-danger" /> : null}
          </div>
        </form>
      </div>

    );
  }
}
