import React from 'react';
import {} from './SuccessCreatePost.scss';

export function SuccessRentPost() {
  return (
    <div className="success-container">
      <div className="success-container__wrapper">
        <div className="success-container__congtrats-text">Congrats!</div>
        <i className="icon icon--success-lg" />
        <p className="success-container__success-text">Your application has been sent. <br />We will get back to you soon :)</p>
      </div>
      <div className="panel-info">
        <i className="icon icon--worry panel-info__icon" />
        <span className="panel-info__text">Do not wire money, send your ID or share your private information. Please report any user who asks for it.</span>
      </div>
    </div>
  );
}

export default SuccessRentPost;
