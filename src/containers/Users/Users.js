import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from 'config';
import {} from './Users.scss';
import { FilterHeader, ListUser, FilterForm, User, NewMessage } from 'components';
import { setBodyClassname, historyState, truncateUserName, scrollToXY } from 'utils/helpers';
import { Modal, Loader, Pagination, DisableComponent } from 'elements'; // eslint-disable-line
import { createConversation, createMessage } from 'redux/modules/conversations';
import { showNotification, showDefault } from 'redux/modules/notifications';
import { setFilters, changeFilters, clearFilter, clearAllFilters, clear, updateUsers } from 'redux/modules/users';
import { saveLocation } from 'redux/modules/location';
import { addToFavorite, removeFavorite } from 'redux/modules/favorites';
import { showAuth, showEmail } from 'redux/modules/modals';
import { replace, push } from 'react-router-redux';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();
    if (!state.users.loaded) {
      promises.push(dispatch(setFilters({})));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    user: state.auth.user,
    users: state.users.users,
    location: state.routing.locationBeforeTransitions,
    filters: state.users.filters,
    pagination: state.users.pagination,
    current_page: state.users.page,
    chosen_location: state.location.location,
    conv_loading: state.conversations.conv_loading,
    loading_message: state.conversations.loading_message,
    wanted: state.favorites.wanted,
  }),
  {
    clearUsers: clear,
    createConversation,
    createMessage,
    showNotification,
    setFilters,
    changeFilters,
    clearAllFilters,
    clearFilter,
    saveLocation,
    addToFavorite,
    removeFavorite,
    showAuth,
    showEmail,
    replace,
    push,
    showDefault,
    updateUsers
  }
)
export default class Users extends Component {
  static propTypes = {
    user: PropTypes.object,
    users: PropTypes.array,
    clearUsers: PropTypes.func,
    createConversation: PropTypes.func,
    createMessage: PropTypes.func,
    showNotification: PropTypes.func,
    clearFilter: PropTypes.func,
    clearAllFilters: PropTypes.func,
    setFilters: PropTypes.func,
    changeFilters: PropTypes.func,
    saveLocation: PropTypes.func,
    filters: PropTypes.object,
    pagination: PropTypes.object,
    params: PropTypes.object,
    chosen_location: PropTypes.string,
    conv_loading: PropTypes.bool,
    loading_message: PropTypes.bool,
    wanted: PropTypes.array,
    addToFavorite: PropTypes.func,
    removeFavorite: PropTypes.func,
    showAuth: PropTypes.func,
    showEmail: PropTypes.func,
    replace: PropTypes.func,
    push: PropTypes.func,
    showDefault: PropTypes.func,
    updateUsers: PropTypes.func,
    location: PropTypes.object,
  };

  static defaultProps = {
    filters: {}
  };

  constructor() {
    super();
    this.state = {
      filters_modal_is_opened: false,
      users_modal_is_opened: false,
      message_modal_is_opened: false,
    };
    this.userId = null;

    this.toggleFiltersModal = this.toggleFiltersModal.bind(this);
    this.toggleUserModal = this.toggleUserModal.bind(this);
    this.hideMessageModal = this.hideMessageModal.bind(this);
    this.showMessageModal = this.showMessageModal.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.checkMessage = this.checkMessage.bind(this);
  }

  componentDidMount() {
    const {params: {city, state, country}, location} = this.props;
    if (location.query && location.query.post_sold) {
      this.props.showDefault('post_sold');
      this.props.replace(location.pathname);
    }
    if (city && state && country) {
      this.props.saveLocation(`${city}--${state}--${country}`);
    }
    setBodyClassname('body-users');
    scrollToXY();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.location.query.post_sold && nextProps.location.query.post_sold) {
      this.props.showDefault('post_sold');
      this.props.replace(nextProps.location.pathname);
    }
    if (this.props.chosen_location !== nextProps.chosen_location) {
      this.props.setFilters({});
    }
    if (this.props.location.query.page !== nextProps.location.query.page) {
      if (parseFloat(nextProps.location.query.page) !== parseFloat(nextProps.current_page)) {
        this.props.setFilters({}, nextProps.location.query.page);
      }
    }
  }

  componentWillUnmount() {
    this.props.clearUsers();
  }

  toggleFiltersModal() {
    this.setState({
      filters_modal_is_opened: !this.state.filters_modal_is_opened,
    });
  }

  toggleUserModal(id, address) {
    address = address || cookie.load('chosen_location');

    this.setState({
      users_modal_is_opened: !this.state.users_modal_is_opened,
    });
    historyState(id, 'user_opened', `${address}/${id}`);
    this.userId = id;
  }

  checkMessage(id, name, avatar) {
    const { user } = this.props;

    if (user && user.email_present) {
      this.showMessageModal(id, name, avatar);
    } else if (user) {
      this.props.showEmail(() => this.showMessageModal(id, name, avatar));
    } else {
      this.props.showAuth(() => this.showMessageModal(id, name, avatar));
    }
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
    const { user } = this.props;
    const name = `${user.first_name} - ${truncateUserName(this.state.message_for, true)}`;
    return new Promise((resolve, reject_promise) => {
      this.props.createConversation({name, user_id: this.state.message_id}).then((r) => {
        this.props.createMessage(r.conversation.id, {message: {body: text}}).then((resp) => {
          this.hideMessageModal();
          this.props.showNotification('message_success', {text: 'Your message has been sent', type: 'success'});
          return resolve(resp);
        }, (err) => reject_promise(err));
      }, (err) => reject_promise(err));
    });
  }

  render() {
    const { users, filters, pagination, wanted, location } = this.props;
    // console.log(users);
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

    const filters_count = Object.keys(filters).length || 0;

    return (
      <div>
        <DisableComponent.Footer />
        <Helmet {...config.app.head} />
        <FilterHeader
          toggleFiltersModal={this.toggleFiltersModal}
          filters={filters}
          clearFilter={this.props.clearFilter}
          clearAll={this.props.clearAllFilters}
          hideMapBtn
        />
        <div className="container--extra-desktop-width container users">
          <div className="users__list">
            <ListUser
              title={filters_count > 0 ? `Showing — ${users.length} posts` : ''}
              sendMessage={this.checkMessage}
              users={users}
              toggleUserModal={this.toggleUserModal}
              addToFavorite={this.props.addToFavorite}
              removeFavorite={this.props.removeFavorite}
              favorites={wanted}
            />
            {pagination && pagination.total_pages > 1 && <Pagination {...pagination_options} />}
          </div>

        </div>

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
          className="modal--user-profile"
          handleClose={this.toggleUserModal}
          opened={this.state.users_modal_is_opened}
          innerButtonClose
        >
          <User userId={this.userId} updateUsers={this.props.updateUsers} />
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
