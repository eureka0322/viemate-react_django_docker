import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { asyncConnect } from 'redux-connect';
import { reduxForm, formValueSelector } from 'redux-form';
import { push, replace } from 'react-router-redux';
import Helmet from 'react-helmet';
import config from 'config';
import {} from './Products.scss';
import {
  FilterHeader,
  ListApartment,
  Map,
  FilterForm,
  Product,
  Profile,
} from 'components';
import { ProductsMobile } from 'containers';
import { setBodyClassname, historyState, scrollToXY } from 'utils/helpers';
import { Modal, Pagination, Form, ScreenType, DisableComponent } from 'elements';
import { load, clearAllFilters, clearFilter, setFilters, getCityBounds, clearProducts, changeFilters, changeView, updateProducts } from 'redux/modules/products';
import { saveLocation } from 'redux/modules/location';
import { addToFavorite, removeFavorite } from 'redux/modules/favorites';
import { showDefault } from 'redux/modules/notifications';
import { addViewedPost } from 'redux/modules/map';

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();
    if (!state.products.loaded) {
      const location = state.routing.locationBeforeTransitions;
      const page = (location.query && location.query.page) || 1;
      promises.push(dispatch(getCityBounds(`${params.city}--${params.state}--${params.country}`)).then((r) => dispatch(setFilters({location: r.location}, page)), () => dispatch(load(page))));
    }
    // promises.push(dispatch(setFilters())); //eslint-disable-line
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    products: state.products.products,
    loading: state.products.loading,
    pagination: state.products.pagination,
    current_page: state.products.page,
    filters: state.products.filters,
    center: state.products.center,
    map_view: state.products.map_view,
    location: state.routing.locationBeforeTransitions,
    chosen_location: state.location.location,
    allowed_filters: state.products.allowed_filters,
    coordinates: formValueSelector('form-map-search')(state, 'coordinates'),
    offered: state.favorites.offered,
    viewed_posts: state.map.viewed_posts,
    hide_current_filter: state.flags.hide_current_filter,
  }),
  {
    load,
    push,
    replace,
    clearAllFilters,
    clearFilter,
    clearProducts,
    setFilters,
    changeFilters,
    getCityBounds,
    saveLocation,
    addToFavorite,
    removeFavorite,
    showDefault,
    addViewedPost,
    changeView,
    updateProducts
  }
)
@reduxForm({
  form: 'form-map-search'
})
export default class Products extends Component {
  static propTypes = {
    products: PropTypes.array,
    filters: PropTypes.object,
    clearAllFilters: PropTypes.func,
    clearFilter: PropTypes.func,
    changeFilters: PropTypes.func,
    getCityBounds: PropTypes.func,
    clearProducts: PropTypes.func,
    setFilters: PropTypes.func,
    change: PropTypes.func,
    center: PropTypes.object,
    coordinates: PropTypes.object,
    pagination: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    push: PropTypes.func,
    replace: PropTypes.func,
    load: PropTypes.func,
    saveLocation: PropTypes.func,
    chosen_location: PropTypes.string,
    // current_page: PropTypes.number,
    offered: PropTypes.array,
    addToFavorite: PropTypes.func,
    removeFavorite: PropTypes.func,
    showDefault: PropTypes.func,
    addViewedPost: PropTypes.func,
    updateProducts: PropTypes.func,
    viewed_posts: PropTypes.array,
    // loading: PropTypes.bool,
    hide_current_filter: PropTypes.bool,
    map_view: PropTypes.bool,
    changeView: PropTypes.func,
    // loading: PropTypes.bool,
  };

  static defaultProps = {
    filters: {}
  };

  constructor() {
    super();
    this.state = {
      filters_modal_is_opened: false,
      product_modal_is_opened: false,
      users_modal_is_opened: false,
      map_loaded: false,
    };
    this.productId = null;
    this.profileId = null;
    this.updateZoom = false;

    this.toggleFiltersModal = ::this.toggleFiltersModal;
    this.toggleProductModal = ::this.toggleProductModal;
    this.toggleUserModal = ::this.toggleUserModal;
    this.setFilters = ::this.setFilters;
    this.changeMobileView = ::this.changeMobileView;
    this.handleRequest = ::this.handleRequest;
    this.stopRequest = ::this.stopRequest;
  }

  componentDidMount() {
    const {params: {city, country, state}, location} = this.props;
    if (location.query && location.query.post_sold) {
      this.props.showDefault('post_sold');
      this.props.replace(location.pathname);
    }
    if (city && state && country) {
      this.props.saveLocation(`${city}--${state}--${country}`);
    }
    setBodyClassname('body-products');
    this.setState({map_loaded: true}); // eslint-disable-line
    scrollToXY();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.location.query.post_sold && nextProps.location.query.post_sold) {
      this.props.showDefault('post_sold');
      this.props.replace(nextProps.location.pathname);
    }
    if (this.props.location.query.page !== nextProps.location.query.page) {
      if (parseFloat(nextProps.location.query.page) !== parseFloat(nextProps.current_page)) {
        this.props.setFilters({}, nextProps.location.query.page);
      }
    }
    if (this.props.chosen_location && nextProps.chosen_location && this.props.chosen_location !== nextProps.chosen_location) {
      this.props.getCityBounds(nextProps.chosen_location).then((r) => this.props.setFilters({location: r.location}, 1), () => this.props.load(1));
    }
    if (!this.updateZoom && JSON.stringify(this.props.coordinates) !== JSON.stringify(nextProps.coordinates)) {
      this.updateZoom = true;
    }
  }

  componentDidUpdate() {
    if (this.updateZoom) this.updateZoom = false;
  }

  componentWillUnmount() {
    this.props.clearProducts();
    this.stopRequest();
  }

  setFilters(filter) {
    this.props.setFilters(filter, 1, this.handleRequest).then(() => {
      this._filter_req = null;
      this.props.push({pathname: `/apartments/${cookie.load('chosen_location')}`, query: {...this.props.location.query, page: 1}});
    });
  }

  handleRequest(req) {
    this._filter_req = req;
  }

  stopRequest() {
    if (this._filter_req) {
      this._filter_req.abort();
      this._filter_req = null;
    }
  }

  changeMobileView() {
    this.props.changeView(!this.props.map_view);
  }

  toggleFiltersModal() {
    this.setState({
      filters_modal_is_opened: !this.state.filters_modal_is_opened
    });
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
    const { products, filters, center, coordinates, change, pagination, location, offered, viewed_posts, hide_current_filter } = this.props;
    // console.log(products);
    const pagination_options = pagination && pagination.total_pages > 1 ?
    {
      pages: pagination.total_pages,
      // pages: 33,
      pagesRange: 3,
      selectedPage: parseFloat((location.query && location.query.page) || 1),
      clickCallback: (page) => this.props.push({...location, query: {...location.query, page}}),
      containerClassName: 'pagination__list',
      // subContainerClassName: 'pages pagination',
      activeClassName: 'active',
      linkClassName: 'pagination__item-link',
      pageClassName: 'pagination__item',
      previousClassName: 'pagination__prev',
      nextClassName: 'pagination__next',
      location,
    }
    :
    {};

    const filters_count = Object.keys(filters).filter(c => c !== 'location').length || 0;

    return (
      <div>
        <DisableComponent.Footer />
        <Helmet {...config.app.head} />
        <FilterHeader
          toggleFiltersModal={this.toggleFiltersModal}
          filters={filters}
          clearFilter={this.props.clearFilter}
          clearAll={this.props.clearAllFilters}
          changeMobileView={this.changeMobileView}
          map_view={this.props.map_view}
          hide_current_filter={hide_current_filter}
        />
        <ScreenType.Desktop>
          <div className="container--desktop-width container products">
            <div className="products__list">
              <ListApartment
                className="list-apartment--offered-places"
                title={filters_count > 0 ? `Showing — ${!!products && products.length} apartments` : ''}
                toggleProductModal={this.toggleProductModal}
                toggleUserModal={this.toggleUserModal}
                products={products}
                highlightMarkers
                addViewedPost={this.props.addViewedPost}
                addToFavorite={this.props.addToFavorite}
                removeFavorite={this.props.removeFavorite}
                favorites={offered}
              />
              {pagination && pagination.total_pages > 1 && <Pagination {...pagination_options} />}
            </div>
            <div className="products__location">
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
                  setFilters={this.setFilters}
                  defaultZoom={10}
                  zoom={(this.updateZoom && coordinates) ? 14 : this.updateZoom ? 10 : null}
                  center={coordinates || center}
                  toggleProductModal={this.toggleProductModal}
                  toggleUserModal={this.toggleUserModal}
                  preventUpdate={this.state.product_modal_is_opened}
                  zoomControl
                  addViewedPost={this.props.addViewedPost}
                  mapOptions={{gestureHandling: 'greedy'}}
                  autocompleteId="form-input-search"
                >
                  <form className="products__search">
                    <div className="products__search-wrapper">
                      <Form.MapAutocomplete
                        classNameInput="input input--map-search"
                        name="search"
                        type="text"
                        placeholder="Live close to?"
                        coordinatesName="coordinates"
                        changeForm={change}
                        disableChangeCoordinates
                        clearBtn
                        clearBtnClassName="form-clear-autocomplete"
                      />
                    </div>
                  </form>
                </Map>}
            </div>
          </div>
        </ScreenType.Desktop>
        <ScreenType.TabletMax>
          <ProductsMobile
            {...this.props}
            filters_count={filters_count}
            map_loaded={this.state.map_loaded}
            setFilters={this.setFilters}
            toggleProductModal={this.toggleProductModal}
            toggleUserModal={this.toggleUserModal}
            pagination_options={pagination_options}
            updateZoom={this.updateZoom}
          />
        </ScreenType.TabletMax>
        <Modal
          className="modal--filters"
          handleClose={this.toggleFiltersModal}
          opened={this.state.filters_modal_is_opened}
          innerButtonClose
        >
          <FilterForm
            setFilters={this.props.setFilters}
            changeFilters={this.props.changeFilters}
            clearFilter={this.props.clearFilter}
            filters={filters}
            pagination={pagination}
            toggleFiltersModal={this.toggleFiltersModal}
          />
        </Modal>
        <Modal
          className="modal--product"
          handleClose={this.toggleProductModal}
          opened={this.state.product_modal_is_opened}
          innerButtonClose
        >
          <Product productId={this.productId} updateProducts={this.props.updateProducts} />
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
