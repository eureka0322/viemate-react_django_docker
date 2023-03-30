import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from 'config';
import { HomeBanner, QuoteBlock, BlockPosts, BlockAdvantages, BannerBottom, Product, Profile, User } from 'components';
import { Modal } from 'elements';
import { setBodyClassname, historyState } from 'utils/helpers';
import { toggleModal } from 'redux/modules/modals';
import { savePrefix } from 'redux/modules/location';
import { load_best } from 'redux/modules/products';
import { setFlag } from 'redux/modules/flags';
import {} from './Home.scss';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();
    if (!state.products.loaded_best) {
      promises.push(dispatch(load_best(100)));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    location_prefix: state.modals.prefix,
    modals: state.modals,
    loading_best: state.products.loading_best,
    best_posts: state.products.best_posts,
    pagination_best: state.products.pagination_best,
    chosen_location: state.location.location,
    banner_animated: state.flags.home_banner_animated,
    // home_animated: state.flags.home_animated,
  }), {
    toggleModal,
    savePrefix,
    load_best,
    setFlag,
  }
)
export default class Home extends Component {
  static propTypes = {
    toggleModal: PropTypes.func,
    savePrefix: PropTypes.func,
    load_best: PropTypes.func,
    loading_best: PropTypes.bool,
    best_posts: PropTypes.array,
    pagination_best: PropTypes.object,
    chosen_location: PropTypes.string,
    banner_animated: PropTypes.bool,
    // home_animated: PropTypes.bool,
    setFlag: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      product_modal_is_opened: false,
      users_modal_is_opened: false,
      profile_modal_is_opened: false,
      animate: false,
    };
    this.handleScroll = ::this.handleScroll;
    this.handleLocation = ::this.handleLocation;
    this.toggleProductModal = ::this.toggleProductModal;
    this.toggleProfileModal = ::this.toggleProfileModal;
    this.toggleUserModal = ::this.toggleUserModal;
    this.headerModifier = 'header-transparent';
  }

  componentDidMount() {
    // console.log(this.props.home_animated);
    // require('lazysizes');
    // window.lazySizesConfig.expand = -10;
    // window.lazySizesConfig.loadMode = 3;
    // window.lazySizesConfig.expFactor = 1;
    // window.lazySizesConfig.init = false;
    // if (!this.props.home_animated && window.lazySizes) {
    //   window.lazySizes.init();
    //   this.setState({animate: true});//eslint-disable-line
    //   this.props.setFlag('home_animated', true);
    // }
    setBodyClassname('body-home');
    this.handleScroll();
    document.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    document.body.classList.remove(this.headerModifier);
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (window.pageYOffset > 0) {
      document.body.classList.remove(this.headerModifier);
    } else {
      document.body.classList.add(this.headerModifier);
    }
  }

  handleLocation(e, prefix) {
    if (!this.props.chosen_location) {
      this.props.toggleModal('location_opened');
      this.props.savePrefix(prefix);
      e.preventDefault();
    }
  }

  toggleProductModal(id, link) {
    this.setState({
      product_modal_is_opened: !this.state.product_modal_is_opened,
    });
    historyState(id, 'product_opened', `${link}`);
    this.productId = id;
  }

  toggleUserModal(id, link) {
    this.setState({
      users_modal_is_opened: !this.state.users_modal_is_opened,
    });
    historyState(id, 'user_opened', `${link}`);
    this.userId = id;
  }

  toggleProfileModal(id) {
    this.setState({
      profile_modal_is_opened: !this.state.profile_modal_is_opened,
    });
    historyState(id, 'user_opened', `/profile/${id}`);
    this.profileId = id;
  }

  render() {
    return (
      <div className="container-home">
        {/*this.state.animate &&
          <style dangerouslySetInnerHTML={{__html: '.lazyload {opacity: 0; transform: translateY(20px)}'}} />
        */}
        <Helmet {...config.app.head} />
        <HomeBanner
          subtitle="Rent directly from tenants and landlords"
          handleLocation={this.handleLocation}
          is_animated={this.props.banner_animated}
          handleAnimate={() => this.props.setFlag('home_banner_animated', true)}
        />
        <QuoteBlock quoteTitle="You’re here because you’re probably sick and tired of searching." quoteContent="We source great, compatible roommates and tenants for you, at the click of a button. Let us take the stress out of moving homes and finding like minded people, so you don’t have to." />
        {this.props.best_posts && <BlockPosts toggleProductModal={this.toggleProductModal} toggleUserModal={this.toggleUserModal} toggleProfileModal={this.toggleProfileModal} loadBest={this.props.load_best} posts={this.props.best_posts} loading={this.props.loading_best} pagination={this.props.pagination_best} title="Some of our best posts" roomType="Private room" price="$1,220" location="Beacon hill" />}
        {/*<BlockAdvantages title="Why Viemate? Short headline." description="Some sweet text about how wonderful Victor and Viemate is. We should just keep it at maybe four lines?" />*/}
        <BlockAdvantages />
        <BannerBottom title="let us take the rein" description="We trim the fat and cut straight to the chase. Your time is valuable to us. Just sign up, and try our search - you never know where you might call home."
          handleLocation={this.handleLocation}
        />
        <Modal
          className="modal--user-profile"
          handleClose={this.toggleUserModal}
          opened={this.state.users_modal_is_opened}
          innerButtonClose
        >
          <User userId={this.userId} />
        </Modal>
        <Modal
          className="modal--product"
          handleClose={this.toggleProductModal}
          opened={this.state.product_modal_is_opened}
          innerButtonClose
        >
          <Product productId={this.productId} />
        </Modal>
        <Modal
          className="modal--user-info"
          handleClose={this.toggleProfileModal}
          opened={this.state.profile_modal_is_opened}
          innerButtonClose
        >
          <Profile profileId={this.profileId} />
        </Modal>
      </div>
    );
  }
}
