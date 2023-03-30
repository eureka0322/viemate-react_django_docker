import React from 'react';
import {} from './SuccessCreatePost.scss';
import { Form } from 'elements';

export function SuccessCreatePost() {
  return (
    <div className="success-container">
      <div className="success-container__wrapper">
        <div className="success-container__congtrats-text">Congrats!</div>
        <i className="icon icon--success-lg" />
        <p className="success-container__success-text">Your wanted post was created.</p>
        <Form.Button
          className="form-button form-button--user-action form-button--full-width form-button--default-dark"
          type="button"
        >
          <span>See it</span>
        </Form.Button>
      </div>
    </div>
  );
}

export default SuccessCreatePost;
