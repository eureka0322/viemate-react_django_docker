import React, { PropTypes } from 'react';
import {} from './ProductNavBtn.scss';
import { Form } from 'elements';
import { Link } from 'react-router';

export default function ProductAdminBtn({ activate, showFeedBack, status, activation_loading, setStatus, updateProduct, updateProducts, updateUsers, postType, postId }) {
  return (
    <div className="product-nav">
      {status === 'published' &&
        <Form.Button
          className={'form-button--circle form-button--default-dark form-button--edit form-button--loader' + (activation_loading ? ' form-button--loading' : '')}
          onClick={() => {
            showFeedBack();
          }}
          disabled={activation_loading}
          type="button"
        >
          <span>
            Deactivate
          </span>
        </Form.Button>
      }
      {status !== 'published' &&
        <Form.Button
          className={'form-button--circle form-button--pink form-button--publish form-button--loader' + (activation_loading ? ' form-button--loading' : '')}
          onClick={() => {
            activate()
              .then(r => {
                if (setStatus) setStatus(r.post); // update list manage posts
                if (updateProducts) updateProducts(r.post); // update list offered products
                if (updateUsers) updateUsers(r.post); // update list wanted posts
                updateProduct(r.post); // update cur prod
              })
              .catch(err => console.log(err));
          }}
          disabled={activation_loading}
          type="button"
        >
          <span>
            Activate
          </span>
        </Form.Button>
      }
      <Link
        className="form-button--circle form-button--default-dark form-button--edit"
        to={postType === 'wanted' ? `/wanted-post/${postId}` : `/offered-post/${postId}`}
      >
        Edit
      </Link>
    </div>
  );
}

ProductAdminBtn.propTypes = {
  activation_loading: PropTypes.bool,
  activate: PropTypes.func,
  showFeedBack: PropTypes.func,
  setStatus: PropTypes.func,
  updateProduct: PropTypes.func,
  updateProducts: PropTypes.func,
  updateUsers: PropTypes.func,
  status: PropTypes.string,
  postType: PropTypes.string,
  postId: PropTypes.number,
};
