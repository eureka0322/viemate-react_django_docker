import React, { PropTypes } from 'react';
import {} from './ProductAction.scss';
import DropdownShare from './DropdownShare';
import { Form } from 'elements';

function Action(props) {
  return (
    <div className="action">
      {<div className="action--btn-wrapper">
        <Form.Button
          className="form-button form-button--circle form-button--pink form-button--full-width form-button--rent"
          onClick={() => props.showRentModal()}
          disabled={false}
          type="button"
        >
          <span>
            Rent the place
          </span>
        </Form.Button>
      </div>}
      <div className="form-button-group action__btn-group">
        <DropdownShare showEmailModal={() => props.showModal('email_modal_is_opened')} message={props.message} />
        <Form.Button
          className="form-button form-button--clear"
          onClick={() => props.showReportModal()}
          disabled={false}
          type="button"
        >
          <span>
            <i className="icon icon--report" />
            <span>Report</span>
          </span>
        </Form.Button>
      </div>
    </div>
  );
}
Action.propTypes = {
  showReportModal: PropTypes.func,
  message: PropTypes.string
};

export default Action;
