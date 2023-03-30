import React from 'react';

/*eslint-disable*/
const Success = () => {
  return (
    <div className="info-box__alert-success">
      <div className="alert alert--success alert--sm">
        <div className="alert__container">
          <div className="alert__container-wrapper">
            <span className="alert__icon alert__icon--md alert__icon--success">
              <i className="icon icon--success" />
            </span>
            <span className="alert__title alert__title--success alert__title--large">We received your message. We will get back to you soon.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
