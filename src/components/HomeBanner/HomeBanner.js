import React, { Component, PropTypes } from 'react';
import {} from './HomeBanner.scss';
import { Link } from 'elements';
import jump from 'jump.js';

export default class HomeBanner extends Component {
  static propTypes = {
    subtitle: PropTypes.string,
    handleLocation: PropTypes.func,
    is_animated: PropTypes.bool,
    handleAnimate: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.preventClick = false;
    this.scrollBottom = ::this.scrollBottom;
    this.text_p1 = 'Let’s '.split('');
    this.text_p2 = 'Find Home'.split('');
    this.state = {
      stage_1: props.is_animated,
      stage_2: props.is_animated,
      stage_3: props.is_animated,
      stage_4: props.is_animated,
      stage_5: props.is_animated,
    };
    this.startAnimation = ::this.startAnimation;
  }

  componentDidMount() {
    if (!this.props.is_animated) {
      this.startAnimation();
      this.props.handleAnimate();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer1);
    clearTimeout(this._timer2);
    clearTimeout(this._timer3);
    clearTimeout(this._timer4);
    clearTimeout(this._timer5);
  }

  startAnimation() {
    this._timer1 = setTimeout(() => this.setState({stage_1: true}), 70);
    this._timer2 = setTimeout(() => this.setState({stage_2: true}), 250);
    this._timer3 = setTimeout(() => this.setState({stage_3: true}), 500);
    this._timer4 = setTimeout(() => this.setState({stage_4: true}), 750);
    this._timer5 = setTimeout(() => this.setState({stage_5: true}), 1700);
  }

  scrollBottom(e) {
    e.preventDefault();
    if (!this.preventClick) {
      this.preventClick = true;
      const _banner_rect = this._banner.getBoundingClientRect();
      const _header = document.querySelector('.header');
      // const _header_rect = _header.getBoundingClientRect();
      jump(_banner_rect.bottom, {
        offset: (_header.offsetHeight * -1) || 0
      });
      setTimeout(() => { this.preventClick = false; }, 500);
    }
  }

  animationRender(array, state, classPre = 'home-banner__title') {
    const {stage_1, stage_2, stage_3, stage_4} = state;
    return array.map((c, i) => {
      const count = i + 1;
      if ((count / 4) - parseInt(count / 4, 10) === 0) {
        return (<span className={`${classPre}--animate`} key={i} style={{opacity: stage_2 ? '1' : '0'}}>{c}</span>);
      }
      if ((count / 3) - parseInt(count / 3, 10) === 0) {
        return (<span className={`${classPre}--animate`} key={i} style={{opacity: stage_4 ? '1' : '0'}}>{c}</span>);
      }
      if ((count / 2) - parseInt(count / 2, 10) === 0) {
        return (<span className={`${classPre}--animate`} key={i} style={{opacity: stage_1 ? '1' : '0'}}>{c}</span>);
      }
      return (<span className={`${classPre}--animate`} key={i} style={{opacity: stage_3 ? '1' : '0'}}>{c}</span>);
    });
  }

  render() {
    const { subtitle } = this.props;
    const { stage_5 } = this.state;

    return (
      <div className="home-banner" ref={n => this._banner = n}>
        <div className="home-banner__wrapper">
          <video className="home-banner__video" autoPlay="true" loop="true"/* poster="https://i.vimeocdn.com/video/601297636.jpg?mw=1920"*/>
            <source src="https://player.vimeo.com/external/187151895.hd.mp4?s=4a3dfa010f312e6c14135f3f46cda79bb8d93307&profile_id=174" type="video/mp4" />
          </video>
          <div className="home-banner__container home-banner__container--bg">
            <div className="home-banner__content">
              <div className="home-banner__content-wrapper">
                <h2 className="home-banner__title">
                  <span className="home-banner__pre-title">
                    {this.animationRender(this.text_p1, this.state).map(c => c)}
                  </span>
                  {this.animationRender(this.text_p2, this.state).map(c => c)}
                 </h2>
                <h3 className="home-banner__subtitle">{this.animationRender(subtitle.split(''), this.state, 'home-banner__subtitle').map(c => c)}</h3>
                <ul className="home-banner__group-btns home-banner__animated--opacity" style={{opacity: stage_5 ? '1' : '0'}}>
                  <li>
                    <Link to="/apartments/{{location}}"
                      className="form-button form-button--circle form-button--default-white"
                      onClick={e => this.props.handleLocation(e, '/apartments/')}
                    >
                      Search apartments & rooms
                    </Link>
                  </li>
                </ul>
                <div className="home-banner__nav">
                  {stage_5 &&
                    <button onClick={this.scrollBottom} className="form-button form-button--around form-button--default-white form-button--scroll-down home-banner__animated--opacity home-banner__nav--scroll_btn">
                      <svg className="home-banner__nav--circular" viewBox="25 25 50 50">
                        <circle className="home-banner__nav--path" cx="50" cy="50" r="23" fill="none" strokeWidth="3" strokeMiterlimit="10" />
                      </svg>
                      <span className="home-banner__nav--icons">
                        <i className="icon icon--arrow-down-white" />
                        <i className="icon icon--arrow-down-pink" />
                      </span>
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
