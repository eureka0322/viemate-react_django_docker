import React, { Component, PropTypes } from 'react';
// import { executionEnvironment } from 'utils/helpers';
import {} from './Slider.scss';
import { findDOMNode } from 'react-dom';
// import _ from 'lodash';

export default class Slider extends Component {
  static propTypes = {
    options: PropTypes.object,
    // galleryOptions: PropTypes.object,
    slides: PropTypes.array.isRequired,
    handleClick: PropTypes.func,
    getActiveIndex: PropTypes.func,
    activeIndex: PropTypes.number
  };

  constructor() {
    super();
    this.handleGesture = ::this.handleGesture;
  }

  componentDidMount() {
    const { options } = this.props;
    const Swiper = require('swiper/dist/js/swiper');

    if (options.pagination) {
      options.pagination = findDOMNode(this._pagination);
    }
    if (options.navigation) {
      options.nextButton = '.swiper-button-next';
      options.prevButton = '.swiper-button-prev';
    }
    this._swiperMain = new Swiper(findDOMNode(this._swiperMainRef), options);
    if (options.zoom) {
      window.addEventListener('gestureend', this.handleGesture);
    }
    // this._swiperMain.onSlideChangeStart((arg1, arg2) => {
    //   console.log(arg1);
    //   console.log(arg2);
    // });

    // if (galleryOptions) {
    //   this._swiperThumbs = new Swiper(findDOMNode(this._swiperThumbsRef), galleryOptions);

    //   this._swiperMain.params.control = this._swiperThumbs;
    //   this._swiperThumbs.params.control = this._swiperMain;
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeIndex >= 0 && nextProps.activeIndex !== this.props.activeIndex) {
      this._swiperMain.slideTo(nextProps.activeIndex, 0);
    }
  }

  // shouldComponentUpdate(nextProps) { // eslint-disable-line
  //   if (executionEnvironment().canUseDOM) {
  //     this._swiperMain.update();
  //     // if (_.isNumber(nextProps.activeIndex)) {
  //     //   this._swiperMain.slideTo(nextProps.activeIndex);
  //     // }
  //     return true;
  //   }
  //   return false;
  // }

  componentWillUnmount() {
    // if (executionEnvironment().canUseDOM) {
    window.removeEventListener('gestureend', this.handleGesture);
    this._swiperMain.destroy();
    if (this.props.getActiveIndex) this.props.getActiveIndex(this._swiperMain.activeIndex);
    if (this._swiperThumbs) this._swiperThumbs.destroy();
    // }
  }

  handleGesture(e) {
    if (this._swiperMain) {
      if (e.scale < 1) {
        this._swiperMain.updateContainerSize();
      } else if (e.scale > 1) {
        this._swiperMain.updateContainerSize();
      }
    }
  }

  render() {
    const { slides, options, handleClick } = this.props;

    return (
      <div>
        <div className={'swiper swiper--top' + (slides.length < 2 ? ' swiper--single-slide' : '')}>
          <div className="swiper-container swiper-main" ref={c => this._swiperMainRef = c}>
            <div className="swiper-wrapper">
              {slides.map((c, i) => {
                if (options.zoom) {
                  return (
                    <div className="swiper-slide" key={c.id} {...(handleClick ? {onClick: () => handleClick(i)} : {})}>
                      <div className="swiper-zoom-container">
                        <img className={'img-slider' + (+c.image_height > +c.image_width ? ' img-vertical' : '')} alt={`slide-${i}`} src={c.urls.original} />
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="swiper-slide" key={c.id} {...(handleClick ? {onClick: () => handleClick(i)} : {})}>
                    <img className={'img-slider' + (+c.image_height > +c.image_width ? ' img-vertical' : '')} alt={`slide-${i}`} src={c.urls.original} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="swiper-controls">
            {options.pagination && <div className="swiper-pagination" ref={c => this._pagination = c} />}
            {options.navigation && <div className="swiper-button-prev" />}
            {options.navigation && <div className="swiper-button-next" />}
          </div>
        </div>
        { /*{galleryOptions &&
          <div className="swiper swiper--bottom">
            <div className="swiper-container swiper-thumbs" ref={c => this._swiperThumbsRef = c}>
              <div className="swiper-wrapper">
                {slides.map(c =>
                  <div key={c.id} className="swiper-slide swiper-slide--thumb" style={{backgroundImage: `url(${c.urls.small})`}} />
                )}
              </div>
            </div>
          </div>} */ }
      </div>
    );
  }
}
