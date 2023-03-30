import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { asyncConnect } from 'redux-connect';
import { reduxForm, formValueSelector } from 'redux-form';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import config from 'config';
import {
  ListApartment,
  Map,
  Product,
  Profile,
} from 'components';
import { setBodyClassname, historyState } from 'utils/helpers';
import { Modal, ScreenType, Form } from 'elements';
import { addToFavorite, removeFavorite, loadFavOffered } from 'redux/modules/favorites';
import { addViewedPost } from 'redux/modules/map';

@asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    const promises = [];
    promises.push(dispatch(loadFavOffered()));
    // promises.push(dispatch(setFilters())); //eslint-disable-line
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    products: state.products.products,
    pagination: state.products.pagination,
    current_page: state.products.page,
    filters: state.products.filters,
    center: state.products.center,
    location: state.routing.locationBeforeTransitions,
    chosen_location: state.location.location,
    allowed_filters: state.products.allowed_filters,
    offered: state.favorites.offered,
    favorite_posts: state.favorites.offered_posts,
    viewed_posts: state.map.viewed_posts,
    coordinates: formValueSelector('form-map-search')(state, 'coordinates'),
  }),
  {
    push,
    addToFavorite,
    removeFavorite,
    addViewedPost,
  }
)
@reduxForm({
  form: 'form-map-search'
})
export default class OfferedFavorite extends Component {
  static propTypes = {
    // current_page: PropTypes.number,
    chosen_location: PropTypes.string,
    favorite_posts: PropTypes.array,
    offered: PropTypes.array,
    viewed_posts: PropTypes.array,
    addToFavorite: PropTypes.func,
    removeFavorite: PropTypes.func,
    addViewedPost: PropTypes.func,
    change: PropTypes.func,
    center: PropTypes.object,
    coordinates: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      product_modal_is_opened: false,
      users_modal_is_opened: false,
      map_loaded: false,
      map_view: false,
    };
    this.productId = null;
    this.profileId = null;

    this.toggleProductModal = ::this.toggleProductModal;
    this.toggleUserModal = ::this.toggleUserModal;
    this.changeMobileView = ::this.changeMobileView;
  }

  componentDidMount() {
    setBodyClassname('body-products');
    this.setState({map_loaded: true}); // eslint-disable-line
  }

  changeMobileView() {
    this.setState({map_view: !this.state.map_view});
  }

  toggleProductModal(id, address) {
    address = address || cookie.load('chosen_location');

    this.setState({
      product_modal_is_opened: !this.state.product_modal_is_opened,
    });
    historyState(id, 'product_opened', `${address}/${id}`);
    this.productId = id;
  }

  toggleUserModal(id) {
    this.setState({
      users_modal_is_opened: !this.state.users_modal_is_opened,
    });
    historyState(id, 'user_opened', `/profile/${id}`);
    this.profileId = id;
  }

  render() {
    const { offered, favorite_posts, center, coordinates, change, viewed_posts } = this.props;
    const products = favorite_posts || [];
    // console.log(products);
    // const pagination_options = pagination && pagination.total_pages > 1 ?
    // {
    //   pages: pagination.total_pages,
    //   // pages: 33,
    //   pagesRange: 3,
    //   selectedPage: parseFloat((location.query && location.query.page) || 1),
    //   clickCallback: (page) => this.props.push({...location, query: {...location.query, page}}),
    //   containerClassName: 'pagination__list',
    //   // subContainerClassName: 'pages pagination',
    //   activeClassName: 'active',
    //   linkClassName: 'pagination__item-link',
    //   pageClassName: 'pagination__item',
    //   previousClassName: 'pagination__prev',
    //   nextClassName: 'pagination__next',
    //   location,
    // }
    // :
    // {};

    return (
      <div>
        <Helmet {...config.app.head} />
          <div className="container--default-width container products products--favourites-wrap">
            <div className="products__list">
              <ListApartment
                className="list-apartment__favourites-container list-apartment--offered-places"
                title={`Showing — ${!!products && products.length} apartments`}
                toggleProductModal={this.toggleProductModal}
                toggleUserModal={this.toggleUserModal}
                products={products}
                highlightMarkers
                addViewedPost={this.props.addViewedPost}
                addToFavorite={this.props.addToFavorite}
                removeFavorite={this.props.removeFavorite}
                chosen_location={this.props.chosen_location}
                favorites={offered}
                is_favorites_list
              />
              {/*pagination && pagination.total_pages > 1 && <Pagination {...pagination_options} />*/}
            </div>
            <ScreenType.Desktop>
              <div className="products__location products__location--favourites-container">
                {this.state.map_loaded &&
                  <Map
                    height="100%"
                    markers_labels={!!products && products.length &&
                      products.map(c => ({
                        content: `${c.price}`,
                        lat: c.latitude,
                        lng: c.longitude,
                        id: c.id,
                        viewed: !!viewed_posts.find(item => item === c.id),
                        cardInfo: { ...c }
                      }))}
                    updateBounds
                    setFilters={() => {}}
                    center={coordinates || center}
                    toggleProductModal={this.toggleProductModal}
                    toggleUserModal={this.toggleUserModal}
                    preventUpdate={this.state.product_modal_is_opened}
                    zoomControl
                    addViewedPost={this.props.addViewedPost}
                  />}
                <form className="products__search">
                  <div className="products__search-wrapper">
                    <Form.MapAutocomplete
                      classNameInput="input input--map-search"
                      name="search"
                      type="text"
                      placeholder="Live close to?"
                      coordinatesName="coordinates"
                      changeForm={change}
                      initialCoordinates={center}
                      disableChangeCoordinates
                      clearBtn
                      clearBtnClassName="form-clear-autocomplete"
                    />
                  </div>
                </form>
              </div>
            </ScreenType.Desktop>
          </div>
        {/*<div className="container--default-width container products products--favourites-wrap">
          <div className="products__list products__list--full-width">
            <ListApartment
              className="list-apartment__favourites-container"
              title={`Showing — ${!!favorite_posts && favorite_posts.length} apartments`}
              toggleProductModal={this.toggleProductModal}
              toggleUserModal={this.toggleUserModal}
              products={favorite_posts}
              addToFavorite={this.props.addToFavorite}
              removeFavorite={this.props.removeFavorite}
              favorites={offered}
              chosen_location={this.props.chosen_location}
              is_favorites_list
            />
            {pagination && pagination.total_pages > 1 && <Pagination {...pagination_options} />}
          </div>
        </div>*/}
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
          handleClose={this.toggleUserModal}
          opened={this.state.users_modal_is_opened}
          innerButtonClose
        >
          <Profile profileId={this.profileId} />
        </Modal>
      </div>
    );
  }
}
