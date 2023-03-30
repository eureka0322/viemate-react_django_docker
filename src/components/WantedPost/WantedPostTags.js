import React, { Component, PropTypes } from 'react';
import { Post } from 'components';
import { Form } from 'elements';
import { reduxForm, Field } from 'redux-form';
import wantedPostValidation from './wantedPostValidation';
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
  form: 'form-wanted-post',
  validate: wantedPostValidation,
  destroyOnUnmount: false,
  // enableReinitialize: true,
  onSubmitFail: (errors) => {
    // header height 72px + extraheight === 92px
    scrollToFirstError(errors, 92);
  }
})
export default class PostFormTags extends Component {
  static propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    productLoading: PropTypes.bool.isRequired,
    friendly: PropTypes.array,
    included: PropTypes.array,
    nearby: PropTypes.array,
  };

  render() {
    const { handleSubmit, error, previousPage, submitting, productLoading, friendly, included, nearby } = this.props;

    return (
      <div>
        <Post.PostHeader className="icon--heart-tag" title="Select from below tags " subtitle="These tags help owners find your post." />
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
          {nearby &&
            <div className="post-form__section post-form__section--tags-container post-form__section--tags-inluded">
              <div className="post-form__label post-form__label--label-checkbox-tags">Accessible Nearby</div>
              <div className="post-form__container">
                <ul className="list-unstyled post-form__checkbox-lists">
                {nearby.map((c, i) =>
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
          <div className="post-form__section post-form__section--form-nav post-form__nav">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark"
              disabled={productLoading}
              onClick={previousPage}
              type="button"
            >
              <span>Back</span>
            </Form.Button>

            <Form.Button
              className={'form-button form-button--user-action form-button--circle form-button--pink form-button--loader' + (productLoading ? ' form-button--loading' : '')}
              disabled={productLoading}
              type="submit"
            >
              <span>Preview</span>
            </Form.Button>

            {error ? <Form.Alert title={error || ''} className="alert-danger" /> : null}
          </div>
        </form>
      </div>

    );
  }
}
