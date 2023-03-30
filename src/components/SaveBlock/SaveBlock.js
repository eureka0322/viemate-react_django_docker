import React, { PropTypes } from 'react';
import {} from './SaveBlock.scss';
import { Form, ProgressBar } from 'elements';
import cx from 'classnames';

export function SaveBlock(props) {
  const { disabled, handleClear, handleSave, progress, editName } = props;

  return (
    <div className="save-block">
      <div className="save-block__container">
        <div className="save-block__title">Do you want to leave without saving your work?</div>
        <p className="save-block__content">You have not saved your work on this page. To save your work click on the Save button. <br />
        You can always come back and edit your {editName || 'profile'}</p>
        <div className="save-block__nav">
          <Form.Button
            className="form-button form-button--user-action form-button--default-dark"
            type="button"
            disabled={disabled}
            onClick={handleClear}
          >
            <span>Leave without saving</span>
          </Form.Button>
          <Form.Button
            className={cx('form-button form-button--user-action form-button--circle form-button--pink form-button--loader form-button--progress', {
              'form-button--loading': disabled,
              'form-button--uploaded': progress === 100
            })}
            type="button"
            disabled={disabled}
            onClick={handleSave}
          >
            <span>Save my work</span>
            <ProgressBar
              className="progress-bar--absolute"
              progress={progress}
              uploadedText="Processing"
              dots
            />
          </Form.Button>
        </div>
      </div>
    </div>
  );
}
SaveBlock.propTypes = {
  handleSave: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  progress: PropTypes.number,
  editName: PropTypes.string
};

export default SaveBlock;
