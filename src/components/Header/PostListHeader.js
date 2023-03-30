import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const PostListHeader = (props) => {
  const {count, title, is_favorites_list, hidden_like, link, back_link, class_prefix} = props;
  return (
    <div className={`${class_prefix}__header`}>
      <h4 className="title">
        {title}
      </h4>
      <div className="list-apartment__nav-fav">
        {is_favorites_list &&
          <Link className="message-title__item message-title__item--back" to={back_link}>
            <i className="icon icon--arrow-back" />
            <span>Back to all listing</span>
          </Link>
        }
        {!hidden_like && is_favorites_list &&
          <div className={`${class_prefix}__favourite-nav`}>
            <div
              className="form-button--favourite form-button--clear"
            >
              <span>
                <i className="icon icon--like-best" />
              </span>
            </div>
          </div>
        }
        {!hidden_like && !is_favorites_list &&
          <div className={`${class_prefix}__favourite-nav`}>
            <Link
              className="form-button--favourite form-button--clear"
              to={link}
            >
              <span>
                <i className="icon icon--like-full-grey"><span className="count">{count}</span></i>
              </span>
            </Link>
          </div>
        }
      </div>
    </div>
  );
};

PostListHeader.propTypes = {
  count: PropTypes.number,
  title: PropTypes.string,
  link: PropTypes.string,
  back_link: PropTypes.string,
  is_favorites_list: PropTypes.bool,
  hidden_like: PropTypes.bool,
  class_prefix: PropTypes.string,
};

PostListHeader.defaultProps = {
  back_link: '/',
  is_favorite_list: false,
  hidden_like: false,
  class_prefix: 'list-apartment',
  link: '/favorite-apartments',
};

export default PostListHeader;
