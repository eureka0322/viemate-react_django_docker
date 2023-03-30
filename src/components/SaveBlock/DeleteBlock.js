import React, { Component, PropTypes } from 'react';
import {} from './SaveBlock.scss';
import { Form } from 'elements';

export default class DeleteBlock extends Component {

  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  render() {
    const { disabled, onConfirm, onCancel } = this.props;
    return (
      <div className="save-block">
        <div className="save-block__container">
          <div className="save-block__title">Do you want to remove conversation?</div>
          <p className="save-block__content">Do you want to remove conversation?</p>
          <div className="save-block__nav">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark"
              type="button"
              disabled={disabled}
              onClick={onCancel}
            >
              <span>Cancel</span>
            </Form.Button>
            <Form.Button
              className="form-button form-button--user-action form-button--circle form-button--pink"
              // disabled={productLoading}
              type="button"
              disabled={disabled}
              onClick={onConfirm}
            >
              <span>Remove</span>
            </Form.Button>
          </div>
        </div>
      </div>
    );
  }

}

