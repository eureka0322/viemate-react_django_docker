import React, { PropTypes } from 'react';
import { ListApartment, Map } from 'components';
import { Pagination, Form, DisableComponent } from 'elements';

const ProductsMobile = (props) => {
  if (props.map_view) {
    const { viewed_posts } = props;

    return (
      <div className="products__location">
        <DisableComponent.Header />
        <DisableComponent.CurrentFilters />
        {props.map_loaded &&
          <Map
            height="100%"
            markers_labels={!!props.products && props.products.length &&
              props.products.map(c => ({
                content: `${c.price}`,
                lat: c.latitude,
                lng: c.longitude,
                id: c.id,
                viewed: !!viewed_posts.find(item => item === c.id),
                cardInfo: { ...c }
              }))}
            updateBounds
            setFilters={props.setFilters}
            defaultZoom={10}
            zoom={(props.updateZoom && props.coordinates) ? 14 : props.updateZoom ? 10 : null}
            center={props.coordinates || props.center}
            toggleProductModal={props.toggleProductModal}
            toggleUserModal={props.toggleUserModal}
            zoomControl
            addViewedPost={props.addViewedPost}
            mapOptions={{gestureHandling: 'greedy'}}
            autocompleteId="form-input-search"
          />}
        <form className="products__search">
          <div className="products__search-wrapper">
            <Form.MapAutocomplete
              classNameInput="input input--map-search"
              name="search"
              type="text"
              placeholder="Live close to?"
              coordinatesName="coordinates"
              changeForm={props.change}
              initialCoordinates={props.center}
              disableChangeCoordinates
              clearBtn
              clearBtnClassName="form-clear-autocomplete"
            />
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className="products__list">
      <ListApartment
        className="list-apartment--offered-places"
        title={props.filters_count > 0 ? `Showing — ${!!props.products && props.products.length} apartments` : ''}
        toggleProductModal={props.toggleProductModal}
        toggleUserModal={props.toggleUserModal}
        products={props.products}
        addToFavorite={props.addToFavorite}
        removeFavorite={props.removeFavorite}
        favorites={props.offered}
      />
      {!!props.pagination && props.pagination.total_pages > 1 && <Pagination {...props.pagination_options} />}
    </div>
  );
};

ProductsMobile.propTypes = {
  products: PropTypes.array,
  viewed_posts: PropTypes.array,
  offered: PropTypes.array,
  pagination: PropTypes.object,
  center: PropTypes.object,
  coordinates: PropTypes.object,
  pagination_options: PropTypes.object,
  toggleProductModal: PropTypes.func,
  toggleUserModal: PropTypes.func,
  setFilters: PropTypes.func,
  change: PropTypes.func,
  addViewedPost: PropTypes.func,
  map_loaded: PropTypes.bool,
  map_view: PropTypes.bool,
  updateZoom: PropTypes.bool,
  addToFavorite: PropTypes.func,
  removeFavorite: PropTypes.func,
  filters_count: PropTypes.number,
};

export default ProductsMobile;
