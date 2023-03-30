import React, { Component } from 'react';
import {} from './BlockAdvantages.scss';

export default class BlockAdvantages extends Component {
  // static propTypes = {
  //   description: PropTypes.string,
  //   title: PropTypes.string
  // };

  render() {
    // const { description, title } = this.props;
    return (

      <div className="container container--full-width container--bg-white advantages">
        <div className="container container--lg-width">
          <div className="advantages__list">
            <div className="advantages__item">
              <div className="advantages__icon-wrapper lazyload"><div className="table"><span className="advantages__icon">Free</span></div></div>
              <h3 className="advantages__title lazyload">No Subscriptions</h3>
              <p className="advantages__description lazyload">That’s right. No commitments. No scam, and of course no spams. Why pay to find a home, when the best things in life are free.</p>
            </div>
            <div className="advantages__item">
              <div className="advantages__icon-wrapper lazyload"><div className="table"><span className="advantages__icon"><i className="icon icon--lock" /></span></div></div>
              <h3 className="advantages__title lazyload">Secure Payments</h3>
              <p className="advantages__description lazyload">We secure your money transactions through our payment systems of credit card, direct deposit, and PayPal. Your money is safe with us.</p>
            </div>
            <div className="advantages__item">
              <div className="advantages__icon-wrapper lazyload"><div className="table"><span className="advantages__icon"><i className="icon icon--people" /></span></div></div>
              <h3 className="advantages__title lazyload">Trusted Community</h3>
              <p className="advantages__description lazyload">Since 2015, we have have been hell-bent on growing our trusted community of users and making Viemate an exciting and vibrant place for you to explore. Hop on board and buckle up for the ride!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
