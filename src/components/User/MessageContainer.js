import React, { PropTypes } from 'react';
import {} from './MessageContainer.scss';
import DropdownShare from 'components/Product/DropdownShare';
import { Form } from 'elements';

function MessageContainer(props) {
  const { ownPost, productNavBtn } = props;

  return (
    <div className="message-container">
      <div className="message-container--btn-wrapper">
      {!productNavBtn ?
        <Form.Button
          className="form-button form-button--circle form-button--default-dark form-button--full-width form-button--message"
          onClick={() => props.showMessageModal()}
          type="button"
        >
          <span>Message</span>
        </Form.Button> : productNavBtn}
      </div>
      {!ownPost
        ?
        /* SMBD'S POST */
        <div className="btn-group action__btn-group">
          <DropdownShare showEmailModal={() => props.showModal('email_modal_is_opened')} message={props.message} />
          <Form.Button
            className="bnt--clear"
            onClick={() => props.showModal('report_modal_is_opened')}
            disabled={false}
            type="button"
          >
            <span>
              <i className="icon icon--report" />
              Report
            </span>
          </Form.Button>
        </div> :
        /* OWN POST */
        <div className="message-container__share">
          <div className="btn-group action__btn-group">
            <DropdownShare showEmailModal={() => props.showModal('email_modal_is_opened')} message={props.message} />
          </div>
        </div>}
    </div>
  );
}
MessageContainer.propTypes = {
  showModal: PropTypes.func,
  message: PropTypes.string,
  ownPost: PropTypes.bool,
  productNavBtn: PropTypes.node
};

export default MessageContainer;
