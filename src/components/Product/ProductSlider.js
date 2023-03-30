import React, { Component, PropTypes } from 'react';
import { Slider, Modal } from 'elements';
import {} from './ProductSlider.scss';

export default class ProductSlider extends Component {
  static propTypes = {
    slides: PropTypes.array
  };
  static defaultProps = {
    slides: []
  };

  constructor() {
    super();
    this.state = {
      gallery_modal_is_opened: false,
      startIndex: 0
    };

    this.handleClick = ::this.handleClick;
    this.getActiveIndex = ::this.getActiveIndex;
    this.locked = false;
    this.is_touch = false;
  }

  componentDidMount() {
    this.is_touch = 'ontouchstart' in window;
  }

  getActiveIndex(activeIndex) {
    this.setState({ activeIndex });
  }

  handleClick(startIndex = 0) {
    this.toggleGalleryModal();
    this.setState({ startIndex });
  }

  toggleGalleryModal() {
    this.setState({
      gallery_modal_is_opened: !this.state.gallery_modal_is_opened
    });
  }

  render() {
    const { slides } = this.props;

    return (
      <div className="product-slider">
        <Slider
          slides={slides}
          options={{
            loop: false,
            pagination: true,
            navigation: true,
            initialSlide: this.state.startIndex
          }}
          handleClick={this.handleClick}
          activeIndex={this.state.activeIndex}
        />

        <Modal
          className="modal--gallery"
          handleClose={this.handleClick}
          opened={this.state.gallery_modal_is_opened}
          secondaryModal
        >
          <Slider
            slides={slides}
            options={{
              loop: false,
              navigation: true,
              keyboardControl: true,
              zoom: true,
              initialSlide: this.state.startIndex,
              onTouchStart: (swiper) => {
                if (this.is_touch) {
                  if (!this.locked && swiper.zoom.scale > 1) {
                    swiper.lockSwipes();
                    this.locked = true;
                  }
                  if (this.locked && swiper.zoom.scale <= 1) {
                    swiper.unlockSwipes();
                    this.locked = false;
                  }
                }
              }
            }}
            galleryOptions={{
              spaceBetween: 10,
              centeredSlides: true,
              slidesPerView: 'auto',
              touchRatio: 0.2,
              slideToClickedSlide: true,
              initialSlide: this.state.startIndex,
              zoom: true
            }}
            getActiveIndex={this.getActiveIndex}
          />
        </Modal>
      </div>
    );
  }
}
