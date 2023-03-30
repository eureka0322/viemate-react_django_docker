import React, { PropTypes } from 'react';
import {} from './ListUser.scss';
import { UserCard, PostListHeader } from 'components';

const ListUser = ({ title, toggleUserModal, users, sendMessage, favorites, addToFavorite, removeFavorite, is_favorites_list, hidden_like, chosen_location }) =>
  <div className="list-user">
    <PostListHeader
      class_prefix="list-user"
      count={favorites.length}
      title={title}
      is_favorites_list={is_favorites_list}
      hidden_like={hidden_like}
      link={'/favorite-wanted-apartments'}
      back_link={chosen_location ? `/wanted-apartments/${chosen_location}` : '/'}
    />
    <ul className="list-user__lists">
      {!!users.length && users.map((c) => {
        const is_favorite = !!c.id && !!favorites.find(item => item === c.id);
        return (
          <li className="list-user__item" key={c.id}>
            <UserCard
              {...c}
              is_favorite={is_favorite}
              toggleFavorite={is_favorite ? () => removeFavorite(c.id, 'wanted') : () => addToFavorite(c.id, 'wanted')}
              onClick={toggleUserModal}
              sendMessage={() => sendMessage(c.owner.id, c.owner.full_name, c.owner.avatar)}
            />
          </li>
        );
      })}
    </ul>
  </div>;

ListUser.propTypes = {
  title: PropTypes.string,
  toggleUserModal: PropTypes.func,
  sendMessage: PropTypes.func,
  users: PropTypes.array.isRequired,
  favorites: PropTypes.array,
  addToFavorite: PropTypes.func,
  removeFavorite: PropTypes.func,
  is_favorites_list: PropTypes.bool,
  hidden_like: PropTypes.bool,
  chosen_location: PropTypes.string,
};

ListUser.defaultProps = {
  users: [],
  favorites: [],
};
export default ListUser;
