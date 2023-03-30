import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from 'config';
import { ListUser, User, NewMessage } from 'components';
import { setBodyClassname, historyState } from 'utils/helpers';
import { Modal, Loader } from 'elements'; // eslint-disable-line
import { createConversation, createMessage } from 'redux/modules/conversations';
import { showNotification } from 'redux/modules/notifications';
import { addToFavorite, removeFavorite, loadFavWanted } from 'redux/modules/favorites';

@asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    const promises = [];
    promises.push(dispatch(loadFavWanted()));
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    favorite_posts: state.favorites.wanted_posts,
    conv_loading: state.conversations.conv_loading,
    loading_message: state.conversations.loading_message,
    wanted: state.favorites.wanted,
    chosen_location: state.location.location,
  }),
  {
    createConversation,
    createMessage,
    showNotification,
    addToFavorite,
    removeFavorite,
    loadFavWanted,
  }
)
export default class Users extends Component {
  static propTypes = {
    favorite_posts: PropTypes.array,
    createConversation: PropTypes.func,
    createMessage: PropTypes.func,
    showNotification: PropTypes.func,
    // params: PropTypes.object,
    conv_loading: PropTypes.bool,
    loading_message: PropTypes.bool,
    wanted: PropTypes.array,
    addToFavorite: PropTypes.func,
    removeFavorite: PropTypes.func,
    chosen_location: PropTypes.string,
    // loadFavWanted: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      users_modal_is_opened: false,
      message_modal_is_opened: false,
    };
    this.userId = null;

    this.toggleUserModal = this.toggleUserModal.bind(this);
    this.hideMessageModal = this.hideMessageModal.bind(this);
    this.showMessageModal = this.showMessageModal.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    setBodyClassname('body-users');
  }

  toggleUserModal(id, address) {
    address = address || cookie.load('chosen_location');

    this.setState({
      users_modal_is_opened: !this.state.users_modal_is_opened,
    });
    historyState(id, 'user_opened', `${address}/${id}`);
    this.userId = id;
  }

  showMessageModal(id, name, avatar) {
    if (id) {
      this.setState({
        message_id: id,
        message_for: name,
        message_avatar: avatar,
        message_modal_is_opened: true
      });
    }
  }

  hideMessageModal() {
    this.setState({message_id: null, message_modal_is_opened: false, message_for: null});
  }

  sendMessage(text) {
    return new Promise((resolve, reject_promise) => {
      this.props.createConversation({name: this.state.message_for, user_id: this.state.message_id}).then((r) => {
        this.props.createMessage(r.conversation.id, {message: {body: text}}).then((resp) => {
          this.hideMessageModal();
          this.props.showNotification('message_success', {text: 'Your message has been sent', type: 'success'});
          return resolve(resp);
        }, (err) => reject_promise(err));
      }, (err) => reject_promise(err));
    });
  }

  render() {
    const { favorite_posts, wanted, chosen_location } = this.props;

    return (
      <div>
        <Helmet {...config.app.head} />
        <div className="container--default-width container users users--favourites-wrap">
          <div className="users__list">
            <ListUser
              className="list-user list-user__favourites-container"
              title={`Showing — ${favorite_posts.length} apartments`}
              sendMessage={this.showMessageModal}
              users={favorite_posts}
              toggleUserModal={this.toggleUserModal}
              addToFavorite={this.props.addToFavorite}
              removeFavorite={this.props.removeFavorite}
              favorites={wanted}
              chosen_location={chosen_location}
              is_favorites_list
            />
          </div>
        </div>
        <Modal
          className="modal--user-profile"
          handleClose={this.toggleUserModal}
          opened={this.state.users_modal_is_opened}
          innerButtonClose
        >
          <User userId={this.userId} />
        </Modal>
        <Modal
          className="modal--report"
          handleClose={this.hideMessageModal}
          opened={this.state.message_modal_is_opened}
          secondaryModal
          innerButtonClose
        >
          <NewMessage sendMessage={this.sendMessage} message_for={this.state.message_for} disabled={this.props.conv_loading || this.props.loading_message} ownerAvatar={this.state.message_avatar} />
        </Modal>
      </div>
    );
  }
}
