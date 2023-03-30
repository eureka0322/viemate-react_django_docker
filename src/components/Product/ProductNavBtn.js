import React, { PropTypes } from 'react';
import {} from './ProductNavBtn.scss';
import { Form } from 'elements';
import { Link } from 'react-router';

export default function ProductNavBtn({
  activate,
  sendToApprove,
  status,
  postId,
  activation_loading,
  push,
  showDefault,
  closePopup,
  setStatus,
  buttonsBottom,
  postType
}) {
  return (
    <div className="product-nav">
      <Link
        className={'form-button form-button--circle form-button--default-dark' + (buttonsBottom ? ' form-button--circle form-button--default-dark form-button--edit' : ' form-button--edit-my-post form-button--full-width')}
        to={postType === 'wanted' ? `/wanted-post/${postId}` : `/offered-post/${postId}`}
      >
        <span>
          {buttonsBottom ? 'Edit' : 'Edit your listing'}
        </span>
      </Link>

      {status === 'initialization' &&
        <Form.Button
          className={'form-button--circle form-button--pink form-button--publish form-button--loader' + (activation_loading ? ' form-button--loading' : '')}
          onClick={() => {
            activate(postId)
              .then((r) => {
                push('/profile/manage-posts');
                showDefault('create_product_success');
                if (closePopup) closePopup();
                if (setStatus) setStatus(r.post, 'published');
              });
          }}
          disabled={activation_loading}
          type="button"
        >
          <span>
            Publish
          </span>
        </Form.Button>
      }
      {status === 'pending' &&
        <Form.Button
          className={'form-button--circle form-button--pink form-button--publish form-button--loader' + (activation_loading ? ' form-button--loading' : '')}
          onClick={() => {
            sendToApprove(postId)
              .then(() => {
                push('/profile/manage-posts');
                showDefault('send_approve_product_success');
                if (closePopup) closePopup();
              });
          }}
          disabled={activation_loading}
          type="button"
        >
          <span>
            Send To Approve
          </span>
        </Form.Button>
      }
    </div>
  );
}

ProductNavBtn.propTypes = {
  activation_loading: PropTypes.bool,
  buttonsBottom: PropTypes.bool,
  activate: PropTypes.func,
  sendToApprove: PropTypes.func,
  push: PropTypes.func,
  showDefault: PropTypes.func,
  closePopup: PropTypes.func,
  setStatus: PropTypes.func,
  status: PropTypes.string,
  postType: PropTypes.string,
  postId: PropTypes.number
};
