import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import UserProfile from './UserProfile';
import MessageContainer from './MessageContainer';
import UserHeader from './UserHeader';
import UserOptions from './UserOptions';
import UserDescription from './UserDescription';
import { load, activate, deactivate, update as updateProduct } from 'redux/modules/product';
import { Loader, Modal } from 'elements';
import { ReportPost, NewMessage, SendEmail, ProductTags, Feedback } from 'components';
import { createConversation, createMessage } from 'redux/modules/conversations';
import { showNotification, showDefault } from 'redux/modules/notifications';
import { addToFavorite, removeFavorite } from 'redux/modules/favorites';
import moment from 'moment';
import ProductNavBtn from 'components/Product/ProductNavBtn';
import ProductAdminBtn from 'components/Product/ProductAdminBtn';
import { truncString, truncateUserName } from 'utils/helpers';
import { showAuth, showEmail } from 'redux/modules/modals';

@connect(
  state => ({
    activation_loading: state.product.activation_loading,
    loading: state.product.loading,
    conv_loading: state.conversations.conv_loading,
    loading_message: state.conversations.loading_message,
    product: state.product.product,
    user: state.auth.user,
    conversation: state.conversations.conversation,
    location: state.routing.locationBeforeTransitions,
    friendly: state.initialAppState.friendly,
    included: state.initialAppState.included,
    nearby: state.initialAppState.nearby,
    wanted: state.favorites.wanted,
    errors: state.formErrors
  }),
  {
    load,
    activate,
    deactivate,
    createConversation,
    createMessage,
    showNotification,
    showDefault,
    push,
    addToFavorite,
    removeFavorite,
    showAuth,
    showEmail,
    updateProduct
  }
)
export default class User extends Component {
  static propTypes = {
    userId: PropTypes.number,
    product: PropTypes.object,
    user: PropTypes.object,
    location: PropTypes.object,
    errors: PropTypes.object,
    load: PropTypes.func,
    activate: PropTypes.func,
    deactivate: PropTypes.func,
    createConversation: PropTypes.func,
    createMessage: PropTypes.func,
    showNotification: PropTypes.func,
    showDefault: PropTypes.func,
    push: PropTypes.func,
    removeFavorite: PropTypes.func,
    addToFavorite: PropTypes.func,
    showAuth: PropTypes.func,
    showEmail: PropTypes.func,
    setStatus: PropTypes.func,
    updateProduct: PropTypes.func,
    updateUsers: PropTypes.func,
    loading: PropTypes.bool,
    hidePanel: PropTypes.bool,
    activation_loading: PropTypes.bool,
    conv_loading: PropTypes.bool,
    loading_message: PropTypes.bool,
    friendly: PropTypes.array,
    included: PropTypes.array,
    nearby: PropTypes.array,
    wanted: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {
      report_modal_is_opened: false,
      message_modal_is_opened: false,
      email_modal_is_opened: false,
      feedback_modal_is_opened: false
    };

    this.handleActivate = ::this.handleActivate;
    this.handleDeactivate = ::this.handleDeactivate;
    this.showModal = ::this.showModal;
    this.hideModal = ::this.hideModal;
    this.sendMessage = ::this.sendMessage;
    this.showMessageModal = ::this.showMessageModal;
  }

  componentDidMount() {
    // popup. from users container
    const id = this.props.userId;
    if (id) this.props.load(id);
  }

  sendMessage(text) {
    const {user, product} = this.props;
    const name = `${user.first_name} - ${truncateUserName(product.owner.full_name, true)}`;
    return new Promise((resolve, reject_promise) => {
      this.props.createConversation({name, user_id: product.owner.id}).then((r) => {
        this.props.createMessage(r.conversation.id, {message: {body: text, id: user.id}}).then((resp) => {
          this.hideModal('message_modal_is_opened');
          this.props.showNotification('message_success', {text: 'Your message has been sent', type: 'success'});
          return resolve(resp);
        }, (err) => reject_promise(err));
      }, (err) => reject_promise(err));
    });
  }

  showMessageModal() {
    const { user } = this.props;
    if (user && user.email_present) {
      this.showModal('message_modal_is_opened');
    } else if (user) {
      this.props.showEmail(() => this.showModal('message_modal_is_opened'));
    } else {
      this.props.showAuth(() => this.showModal('message_modal_is_opened'));
    }
  }

  showModal(modal = 'message_modal_is_opened') {
    this.setState({
      [modal]: true
    });
  }

  hideModal(modal = 'message_modal_is_opened') {
    this.setState({
      [modal]: false
    });
  }

  handleActivate() {
    const { product } = this.props;
    if (product) {
      return this.props.activate(product.id, product.post_type);
    }
    return Promise.reject();
  }

  handleDeactivate(data) {
    const { product } = this.props;
    if (product) {
      return this.props.deactivate(product.id, data);
    }
    return Promise.reject();
  }

  selectLeaseTypes(product) {
    const arr = [];
    const lTypes = {
      lease_type_temporary: 'Temporary sublet',
      lease_type_take_over: 'Lease takeover'
    };

    Object.keys(lTypes).forEach(c => product[c] ? arr.push(lTypes[c]) : c);
    return arr;
  }

  selectPlaceType(type) {
    switch (type) {
      case 'entire_apt':
        return 'Entire apartment';
      case 'private_room':
        return 'Private room';
      case 'shared_room':
        return 'Shared room';
      default:
        return '';
    }
  }

  selectGender(gender) {
    switch(gender) { // eslint-disable-line
      case 'male':
        return <i className="icon icon--mustache" />;
      case 'female':
        return <i className="icon icon--female" />;
      default:
        return 'Any';
    }
  }

  render() {
    const { product, user, friendly, included, nearby, location, wanted } = this.props; // eslint-disable-line
    const hidePanel = this.props.hidePanel || product.status === 'initialization';
    const ownPost = user && product.owner && user.id === product.owner.id;
    const ownerObj = product.owner || {};

    const is_favorite = !!product && !!product.id && !!wanted.find(c => c === product.id);

    const friendly_products = product.tag_list ? product.tag_list.filter(c => friendly.find(item => item.name === c)) || [] : [];
    const included_products = product.tag_list ? product.tag_list.filter(c => included.find(item => item.name === c)) || [] : [];
    const nearby_products = product.tag_list ? product.tag_list.filter(c => nearby.find(item => item.name === c)) || [] : [];

    const description = truncString(product.description, 200);
    const title = product.place_type ? `Viemate - ${product.place_type}` : 'Viemate';

    const isAdmin = user && user.admin;
    // console.log(product);

    if (this.props.loading) return <Loader />;

    return (
      <div>
        <Helmet
          title={title}
          meta={[
            {name: 'description', content: description},
            {property: 'og:title', content: title},
            {property: 'og:image', content: product.attachments && product.attachments[0] && product.attachments[0].urls.original},
            {property: 'og:url', content: `${config.domain}/${location.pathname}${location.search}`},
            {property: 'og:description', content: description},
            {property: 'og:price', content: product.price},
            // {'property': 'og:price:currency', content: product.currency},
            {property: 'twitter:data1', content: product.price},
            {property: 'twitter:image:src', content: product.attachments && product.attachments[0] && product.attachments[0].urls.original},
          ]}
        />
        {!hidePanel &&
          <div className="user__profile">
            <UserProfile
              description={truncString(ownerObj.about, 100)}
              name={ownerObj.full_name}
              img={ownerObj.avatar}
              id={ownerObj.id}
              profile={ownerObj}
            />
            <MessageContainer
              message={title}
              showModal={this.showModal}
              showMessageModal={this.showMessageModal}
              ownPost={ownPost}
              productNavBtn={ownPost &&
                <ProductNavBtn postId={product.id} postType={product.post_type} />}
            />
          </div>}
        <div className="user__details">
          <div className="user__details-wrapper">
            <UserHeader
              header="Max rent:"
              price={product.price}
              rentalPeriod="month"
              typeBill="$"
              is_favorite={is_favorite}
              toggleFavorite={is_favorite ? () => this.props.removeFavorite(product.id, 'wanted') : () => this.props.addToFavorite(product.id, 'wanted')}
            />
            <UserOptions
              roomType={this.selectPlaceType(product.place_type)}
              leaseTypes={this.selectLeaseTypes(product)}
              period_from={moment(product.start_date).format('DD MMMM, YYYY')}
              period_to={moment(product.end_date).format('DD MMMM, YYYY')}
              location={product.neighbourhood || '-'}
              gender={this.selectGender(product.gender)}
            />
            <UserDescription descriptionUser={product.description} />
            {friendly_products.length > 0 && <ProductTags titleTag={`FRIENDLY — ${friendly_products.length}`} tags={friendly_products} />}
            {included_products.length > 0 && <ProductTags titleTag={`Included — ${included_products.length}`} tags={included_products} />}
            {nearby_products.length > 0 && <ProductTags titleTag={`Nearby — ${nearby_products.length}`} tags={nearby_products} />}
            {user && product.owner && user.id === product.owner.id && hidePanel &&
              <ProductNavBtn
                postId={product.id}
                status={product.status}
                activate={this.handleActivate}
                activation_loading={this.props.activation_loading}
                push={this.props.push}
                showDefault={this.props.showDefault}
                buttonsBottom={hidePanel}
                postType={product.post_type}
              />}
            {isAdmin &&
              <ProductAdminBtn
                activate={this.handleActivate}
                showFeedBack={() => this.showModal('feedback_modal_is_opened')}
                status={product.status}
                activation_loading={this.props.activation_loading}
                setStatus={this.props.setStatus}
                updateProduct={this.props.updateProduct}
                updateUsers={this.props.updateUsers}
                postType={product.post_type}
                postId={product.id}
              />}
          </div>
        </div>

        <Modal
          className="modal--report"
          handleClose={() => this.hideModal('report_modal_is_opened')}
          opened={this.state.report_modal_is_opened}
          secondaryModal
          innerButtonClose
        >
          <ReportPost id={!!product && product.id} />
        </Modal>
        <Modal
          className="modal--report"
          handleClose={() => this.hideModal('message_modal_is_opened')}
          opened={this.state.message_modal_is_opened}
          secondaryModal
          innerButtonClose
        >
          <NewMessage sendMessage={this.sendMessage} disabled={this.props.conv_loading || this.props.loading_message} ownerAvatar={product.owner && product.owner.avatar} />
        </Modal>
        <Modal
          className="modal--send-email"
          handleClose={() => this.hideModal('email_modal_is_opened')}
          opened={this.state.email_modal_is_opened}
          innerButtonClose
        >
          <SendEmail info={product} />
        </Modal>
        {isAdmin &&
          <Modal
            className="modal--feedback modal--product-no-panel"
            handleClose={() => this.hideModal('feedback_modal_is_opened')}
            opened={this.state.feedback_modal_is_opened}
            innerButtonClose
          >
            <Feedback deactivate={this.handleDeactivate} setStatus={this.props.setStatus} updateProduct={this.props.updateProduct} updateUsers={this.props.updateUsers} toggleFeedbackModal={() => this.hideModal('feedback_modal_is_opened')} errors={this.props.errors} />
          </Modal>
        }
      </div>
    );
  }
}
