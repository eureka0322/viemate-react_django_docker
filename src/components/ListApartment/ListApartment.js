import React, { PropTypes } from 'react';
import {} from './ListApartment.scss';
import { ProductCard, PostListHeader } from 'components';

const ListApartment = ({ title, toggleProductModal, toggleUserModal, products, highlightMarkers, addViewedPost, className, activate, setStatus, activation_loading, hasScroll, user, favorites, addToFavorite, removeFavorite, is_favorites_list, hidden_like, chosen_location, hiddenAvatarLink, toggleFeedbackModal }) =>
  <div>
    <div className={'list-apartment' + (className ? ` ${className}` : '') + (hasScroll ? ' list-apartment--has-scroll' : '')}>
      <PostListHeader
        class_prefix="list-apartment"
        count={favorites.length}
        title={title}
        is_favorites_list={is_favorites_list}
        hidden_like={hidden_like}
        link={'/favorite-apartments'}
        back_link={chosen_location ? `/apartments/${chosen_location}` : '/'}
      />
      <div className="list-apartment__wrap">
        <div className="list-apartment__product-wrap">
          {!!products && !!products.length && products.map((c) => {
            const is_favorite = !!c.id && !!favorites.find(item => item === c.id);
            return (
              <div className="list-apartment__item" key={c.id}>
                <ProductCard
                  is_favorite={is_favorite}
                  toggleFavorite={is_favorite ? () => removeFavorite(c.id, 'offered') : () => addToFavorite(c.id, 'offered')}
                  info={c}
                  onClick={toggleProductModal}
                  toggleUserModal={toggleUserModal}
                  highlightMarkers={highlightMarkers}
                  addViewedPost={addViewedPost}
                  activate={activate}
                  // deactivate={deactivate}
                  setStatus={setStatus}
                  activation_loading={activation_loading}
                  user={user}
                  hiddenAvatarLink={hiddenAvatarLink}
                  toggleFeedbackModal={toggleFeedbackModal}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>;

ListApartment.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  chosen_location: PropTypes.string,
  toggleProductModal: PropTypes.func,
  toggleUserModal: PropTypes.func,
  activate: PropTypes.func,
  // deactivate: PropTypes.func,
  setStatus: PropTypes.func,
  addToFavorite: PropTypes.func,
  addViewedPost: PropTypes.func,
  removeFavorite: PropTypes.func,
  toggleFeedbackModal: PropTypes.func,
  products: PropTypes.array.isRequired,
  favorites: PropTypes.array,
  highlightMarkers: PropTypes.bool,
  activation_loading: PropTypes.bool,
  is_favorites_list: PropTypes.bool,
  hidden_like: PropTypes.bool,
  hasScroll: PropTypes.bool,
  hiddenAvatarLink: PropTypes.bool,
  user: PropTypes.object
};
ListApartment.defaultProps = {
  products: [],
  favorites: [],
};

export default ListApartment;
