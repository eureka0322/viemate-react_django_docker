import React, { Component, PropTypes } from 'react';
import {} from './Footer.scss';
import { Link } from 'react-router';
import twitter from 'twitter-text';
import FormSubscribe from './FormSubscribe';
import moment from 'moment';

export default class Footer extends Component {
  static propTypes = {
    tweet: PropTypes.string,
    tumblr: PropTypes.array,
    blog: PropTypes.object,
    // tweet_loading: PropTypes.bool,
    hide_footer: PropTypes.bool,
  }

  linkText(str) {
    return twitter.autoLink(str);
  }

  render() {
    const {tweet, tumblr, blog, hide_footer} = this.props;
    if (hide_footer) {
      return null;
    }
    return (
      <div className="footer">
        <div className="footer__container container">
          <Link to="/" className="logo-footer lazyload">
            viemate
          </Link>
          <div className="footer__links">
            <div className="footer__links-item footer__links-item--first">
              <h6 className="footer__links title lazyload">{'Navigation'}</h6>
              <ul className="list-unstyled footer__links nav">
                <li className="lazyload">
                  <Link to="/how_it_works">How it works?</Link>
                </li>
                <li className="lazyload">
                  <a target="_blank" rel="noopener noreferrer" href="http://blog.viemate.com">{'Blog'}</a>
                </li>
                {/*<li className="lazyload">
                  <Link to="/press">Press</Link>
                </li>*/}
                <li className="lazyload">
                  <Link to="/privacy_policy">Privacy Policy</Link>
                </li>
                <li className="lazyload">
                  <Link to="/terms_of_service">Terms of Service</Link>
                </li>
                <li className="lazyload">
                  <Link to="/contact_us">Contact us</Link>
                </li>
              </ul>
            </div>
            <div className="footer__links-item footer__links-photos footer__links-item--second">
              <div className="footer__links footer__photos-container">
                <h6 className="footer__links title lazyload">{'Tumblr'}</h6>
                <ul className="list-unstyled">
                  {tumblr && tumblr.map((c, i) => {
                    const photos = c.photos[0];
                    let photo = photos.alt_sizes.find(item => item.width === 250);
                    if (!photo) photo = photos.original_size;
                    return (
                      <li className="lazyload" key={i}>
                        <a href={c.short_url} target="_blank" style={photo ? {backgroundImage: `url(${photo.url.replace('http://', 'https://')})`} : {}} rel="noopener noreferrer">{''}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="footer__links-item footer__links-item--third">
              <h6 className="footer__links title lazyload">{'Subscribe to our newsletter'}</h6>
              <FormSubscribe />
              <h6 className="footer__links title lazyload">{'Recently published'}</h6>
              {blog &&
                <a target="_blank" rel="noopener noreferrer" href={`http://blog.viemate.com${blog.url}`} className="lazyload footer__links--link-title-publication">
                  <span>{blog.title}</span>
                </a>
              }
              {blog && <span className="footer__links--date lazyload">{blog.created_at ? moment(blog.created_at).format('DD MMMM, YYYY') : ''}</span>}
              <h6 className="footer__links title hidden-xs lazyload">{'Twitter'}</h6>
              <ul className="list-unstyled hidden-xs">
                {tweet &&
                  <li>
                    <div className="footer__links--link-twitter lazyload" dangerouslySetInnerHTML={{__html: this.linkText(tweet)}} />
                    <div className="footer__links--link-grey lazyload" dangerouslySetInnerHTML={{__html: this.linkText('- @viemate')}} />
                  </li>
                }
              </ul>
            </div>
          </div>
          <div className="footer-box">
            <span className="footer-box__item copyright hidden-xs lazyload">&copy; 2015 Viemate, Inc.</span>
            <span className="footer-box__item footer-box__item--center viemate lazyload">
              Made with
              <i className="icon icon--heart" />
              in Boston
            </span>
            <ul className="footer-box__item footer-box__item--right social-links list-unstyled">
              <li className="social-links__item lazyload">
                <a href="https://www.instagram.com/viemate/" target="_blank" rel="noopener noreferrer">
                  <i className="icon icon--instagram" />
                </a>
              </li>
              <li className="social-links__item lazyload">
                <a href="http://www.facebook.com/viemate" target="_blank" rel="noopener noreferrer">
                  <i className="icon icon--facebook" />
                </a>
              </li>
              <li className="social-links__item lazyload">
                <a href="http://viemate.tumblr.com" target="_blank" rel="noopener noreferrer">
                  <i className="icon icon--tumblr" />
                </a>
              </li>
              <li className="social-links__item lazyload">
                <a href="https://twitter.com/viemate" target="_blank" rel="noopener noreferrer">
                  <i className="icon icon--twitter" />
                </a>
              </li>
            </ul>
            <span className="footer-box__item copyright visible-xs lazyload">&copy; 2015 Viemate, Inc.</span>
          </div>

        </div>
      </div>
    );
  }
}
