import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { ProfileHeader, SettingHeader, ListApartment, Product, Profile, User, Feedback } from 'components';
import {} from './ManagePosts.scss';
import { setBodyClassname, historyState } from 'utils/helpers';
import { asyncConnect } from 'redux-connect';
import { loadManaged, clearManagedProducts, setStatus } from 'redux/modules/products';
import { activate, deactivate } from 'redux/modules/product';
import { connect } from 'react-redux';
import { Modal } from 'elements';
import cookie from 'react-cookie';
import { addToFavorite, removeFavorite } from 'redux/modules/favorites';
import { loadPayments, loadPayout } from 'redux/modules/payments';

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();
    // const state = getState();
    if (!state.products.managed_loaded) {
      promises.push(dispatch(loadManaged(params)));
    }
    return Promise.all(promises);
  }
},
{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();
    if (!state.payments.payments_loaded) {
      promises.push(dispatch(loadPayments()));
    }
    if (!state.payments.payout_loaded) {
      promises.push(dispatch(loadPayout()));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    activation_loading: state.product.activation_loading, // from producT
    products: state.products.managed_products, // from productS
    user: state.auth.user,
    wanted: state.favorites.wanted,
    offered: state.favorites.offered,
    errors: state.formErrors
  }),
  {
    loadManaged,
    clearManagedProducts,
    activate,
    deactivate,
    setStatus,
    addToFavorite,
    removeFavorite,
  }
)
export default class ManagePosts extends Component {
  static propTypes = {
    products: PropTypes.array,
    clearManagedProducts: PropTypes.func,
    activate: PropTypes.func,
    setStatus: PropTypes.func,
    deactivate: PropTypes.func,
    activation_loading: PropTypes.bool,
    user: PropTypes.object,
    errors: PropTypes.object,
    wanted: PropTypes.array,
    offered: PropTypes.array,
    addToFavorite: PropTypes.func,
    removeFavorite: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      product_modal_is_opened: false,
      wanted_modal_is_opened: false,
      users_modal_is_opened: false,
      feedback_modal_is_opened: false
    };
    this.productId = null;
    this.productStatus = null;
    this.deactivationId = null;

    this.toggleProductModal = ::this.toggleProductModal;
    this.closeProductModals = ::this.closeProductModals;
    this.toggleUserModal = ::this.toggleUserModal;
    this.toggleFeedbackModal = ::this.toggleFeedbackModal;
    this.handleDeactivate = ::this.handleDeactivate;
  }

  componentDidMount() {
    setBodyClassname('body-manage-posts');
  }

  componentWillUnmount() {
    this.props.clearManagedProducts();
  }

  handleDeactivate(data) {
    if (this.deactivationId) {
      return this.props.deactivate(this.deactivationId, data);
    }
    return Promise.reject();
  }

  toggleProductModal(id, address, status, type) {
    address = address || cookie.load('chosen_location');
    const url = type === 'wanted'
      ? `/wanted-apartments/${address}/${id}`
      : `/apartments/${address}/${id}`;

    if (type === 'wanted') {
      this.setState({
        wanted_modal_is_opened: !this.state.wanted_modal_is_opened,
      });
    } else {
      this.setState({
        product_modal_is_opened: !this.state.product_modal_is_opened,
      });
    }
    historyState(id, 'product_opened', url);
    this.productId = id;
    this.productStatus = status;
  }

  closeProductModals() {
    this.setState({
      product_modal_is_opened: false,
      wanted_modal_is_opened: false
    });
    historyState('', 'product_opened', '');
  }

  toggleUserModal(id) {
    this.setState({
      users_modal_is_opened: !this.state.users_modal_is_opened,
    });
    historyState(id, 'user_opened', `/profile/${id}`);
    this.profileId = id;
  }

  toggleFeedbackModal(id) {
    this.setState({feedback_modal_is_opened: !this.state.feedback_modal_is_opened});
    this.deactivationId = id;
  }

  render() {
    const { products, wanted, offered } = this.props;
    const active_products = [];
    const inactive_products = [];
    const approve_products = [];

    products && products.forEach(c => c.status === 'published' ? active_products.push(c) : c.status === 'pending' ? approve_products.push(c) : inactive_products.push(c));
    // console.log(products);

    return (
      <div className="setting-container">
        <Helmet {...config.app.head} />
        <ProfileHeader {...this.props} />
        <div className="container container--md-max-width">
          <SettingHeader title="Manage your posts" subtitle="Here you can manage your posts." />
          <div className="manage-posts manage-posts__list">
            <div className="manage-posts__wrap">
              <div className="manage-posts__active">
                {active_products.length ?
                  <ListApartment
                    className="list-apartment list-apartment--manage-posts"
                    title={`My active posts — ${active_products.length}`}
                    toggleProductModal={this.toggleProductModal}
                    toggleUserModal={this.toggleUserModal}
                    products={active_products}
                    activate={this.props.activate}
                    // deactivate={this.props.deactivate}
                    setStatus={this.props.setStatus}
                    activation_loading={this.props.activation_loading}
                    hasScroll={active_products.length > 4}
                    user={this.props.user}
                    addToFavorite={this.props.addToFavorite}
                    removeFavorite={this.props.removeFavorite}
                    favorites={[...wanted, ...offered]}
                    hidden_like
                    toggleFeedbackModal={this.toggleFeedbackModal}
                  /> : <span className="manage-posts__no-posts">No active posts yet</span>}
              </div>
              <div className="manage-posts__inactive">
                {inactive_products.length ?
                  <ListApartment
                    className="list-apartment list-apartment--manage-posts"
                    title={`My inactive posts — ${inactive_products.length}`}
                    toggleProductModal={this.toggleProductModal}
                    toggleUserModal={this.toggleUserModal}
                    products={inactive_products}
                    activate={this.props.activate}
                    // deactivate={this.props.deactivate}
                    setStatus={this.props.setStatus}
                    activation_loading={this.props.activation_loading}
                    hasScroll={inactive_products.length > 4}
                    user={this.props.user}
                    addToFavorite={this.props.addToFavorite}
                    removeFavorite={this.props.removeFavorite}
                    favorites={[...wanted, ...offered]}
                    hidden_like
                  /> : <span className="manage-posts__no-posts">No inactive posts yet</span>}
              </div>
              <div className="manage-posts__approve">
                {!!approve_products.length &&
                  <ListApartment
                    className="list-apartment list-apartment--manage-posts"
                    title={`My required approve posts — ${approve_products.length}`}
                    toggleProductModal={this.toggleProductModal}
                    toggleUserModal={this.toggleUserModal}
                    products={approve_products}
                    activate={this.props.activate}
                    // deactivate={this.props.deactivate}
                    setStatus={this.props.setStatus}
                    activation_loading={this.props.activation_loading}
                    hasScroll={approve_products.length > 4}
                    user={this.props.user}
                    addToFavorite={this.props.addToFavorite}
                    removeFavorite={this.props.removeFavorite}
                    favorites={[...wanted, ...offered]}
                    hidden_like
                  />}
              </div>
            </div>

          </div>
        </div>

        {/* offered apartment popup */}
        <Modal
          className={'modal--product' + (this.productStatus === 'initialization' ? ' modal--product-no-panel' : '')}
          handleClose={this.closeProductModals}
          opened={this.state.product_modal_is_opened}
          innerButtonClose
        >
          <Product
            productId={this.productId}
            closePopup={this.closeProductModals}
            setStatus={this.props.setStatus}
            hidePanel={this.productStatus === 'initialization'}
          />
        </Modal>
        {/* wanted apartment popup */}
        <Modal
          className="modal--user-profile"
          handleClose={this.closeProductModals}
          opened={this.state.wanted_modal_is_opened}
          innerButtonClose
        >
          <User userId={this.productId} setStatus={this.props.setStatus} />
        </Modal>
        {/* profile popup */}
        <Modal
          className="modal--user-info"
          handleClose={this.toggleUserModal}
          opened={this.state.users_modal_is_opened}
          innerButtonClose
        >
          <Profile profileId={this.profileId} />
        </Modal>

        <Modal
          className="modal--feedback modal--product-no-panel"
          handleClose={this.toggleFeedbackModal}
          opened={this.state.feedback_modal_is_opened}
          innerButtonClose
        >
          <Feedback deactivate={this.handleDeactivate} setStatus={this.props.setStatus} toggleFeedbackModal={this.toggleFeedbackModal} errors={this.props.errors} />
        </Modal>
      </div>
    );
  }
}
