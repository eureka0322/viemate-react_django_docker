import React, { Component, PropTypes } from 'react';
import {} from './SaveBlock.scss';
import { Form } from 'elements';
import classNames from 'classnames';

export default class RemoveCard extends Component {

  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    type: PropTypes.string,
  };

  static defaultProps = {
    type: 'payment'
  }

  render() {
    const { onConfirm, onCancel, loading, type } = this.props;
    return (
      <div className="save-block">
        <div className="save-block__container">
          <div className="save-block__title">{`Do you want to remove ${type} method?`}</div>
          <p className="save-block__content">{`Do you want to remove ${type} method?`}</p>
          <div className="save-block__nav">
            <Form.Button
              className="form-button form-button--user-action form-button--default-dark"
              type="button"
              disabled={loading}
              onClick={onCancel}
            >
              <span>No</span>
            </Form.Button>
            <Form.Button
              className={
                classNames('form-button form-button--user-action form-button--circle form-button--pink', 'form-button--loader', {'form-button--loading': loading})
              }
              type="button"
              disabled={loading}
              onClick={onConfirm}
            >
              <span>Yes</span>
            </Form.Button>
          </div>
        </div>
      </div>
    );
  }

}
