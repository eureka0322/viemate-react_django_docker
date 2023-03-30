import React from 'react';
import {} from './CreatePostMobile.scss';
import { Logo, Link } from 'elements';

function CreatePostMobile(props) {
  return (
    <div className="post container container--base-width">
      <Link to="/" className="post__logo">
        <Logo />
      </Link>
      <div className="post__title"><span>What are you looking for?</span></div>
      <div className="post__list">
        <Link to="/offered-post" className="post__list-item" onClick={props.toggleCreateModal}>
          I have a place
        </Link>
        <Link to="/wanted-post" className="post__list-item" onClick={props.toggleCreateModal}>
          I want a place
        </Link>
      </div>
    </div>
  );
}
CreatePostMobile.propTypes = {
  toggleCreateModal: React.PropTypes.func
};

export default CreatePostMobile;
