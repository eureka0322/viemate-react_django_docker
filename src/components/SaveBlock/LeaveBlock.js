import React, { PropTypes } from 'react';
import {} from './SaveBlock.scss';
import { Form } from 'elements';

export function LeaveBlock(props) {
  const { handleLeave, handleStay } = props;

  return (
    <div className="save-block">
      <div className="save-block__container">
        <div className="save-block__title">Do you want to leave without saving your work?</div>
        <p className="save-block__content">You have not saved your work on this page.</p>
        <div className="save-block__nav">
          <Form.Button
            className="form-button form-button--user-action form-button--default-dark"
            type="button"
            // disabled={disabled}
            onClick={handleStay}
          >
            <span>Stay</span>
          </Form.Button>
          <Form.Button
            className="form-button form-button--user-action form-button--circle form-button--pink"
            type="button"
            // disabled={disabled}
            onClick={handleLeave}
          >
            <span>Leave</span>
          </Form.Button>
        </div>
      </div>
    </div>
  );
}
LeaveBlock.propTypes = {
  handleStay: PropTypes.func.isRequired,
  handleLeave: PropTypes.func.isRequired,
};

export default LeaveBlock;
