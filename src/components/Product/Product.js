import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import ProductHeader from './ProductHeader';
import ProductProfile from './ProductProfile';
import ProductAction from './ProductAction';
import ProductSlider from './ProductSlider';
import ProductOptions from './ProductOptions';
import ProductTags from './ProductTags';
import ProductNavBtn from './ProductNavBtn';
import ProductAdminBtn from './ProductAdminBtn';
import ProductDescription from './ProductDescription';
import { Map, MapForm, ReportPost, NewMessage, SendEmail, ConfirmRent, SuccessRentPost, Feedback } from 'components';
import { Loader, Modal } from 'elements';
import { load, activate, deactivate, sendToApprove, update as updateProduct } from 'redux/modules/product';
import { createConversation, createMessage } from 'redux/modules/conversations';
import { showNotification, showDefault } from 'redux/modules/notifications';
import { setParams, clearDirections, addViewedPost } from 'redux/modules/map';
import { addToFavorite, removeFavorite } from 'redux/modules/favorites';
import { formValueSelector } from 'redux-form';
import moment from 'moment';
import { truncString } from 'utils/helpers';
import { showAuth, showEmail } from 'redux/modules/modals';

@connect(
  state => ({
    activation_loading: state.product.activation_loading,
    loading: state.product.loading,
    product: state.product.product,
    user: state.auth.user,
    conv_loading: state.conversations.conv_loading,
    conversation: state.conversations.conversation,
    loading_message: state.conversations.loading_message,
    location: state.routing.locationBeforeTransitions,
    friendly: state.initialAppState.friendly,
    included: state.initialAppState.included,
    nearby: state.initialAppState.nearby,
    offered: state.favorites.offered,
    coordinates_pointB: formValueSelector('form-map')(state, 'coordinates_pointB'),
    map: state.map,
    errors: state.formErrors
  }),
  {
    load,
    activate,
    deactivate,
    sendToApprove,
    createConversation,
    createMessage,
    showNotification,
    push,
    showDefault,
    addToFavorite,
    removeFavorite,
    showAuth,
    showEmail,
    addViewedPost,
    setMapParams: setParams,
    clearMapDirections: clearDirections,
    updateProduct
  }
)
export default class Product extends Component {
  static propTypes = {
    load: PropTypes.func,
    activate: PropTypes.func,
    deactivate: PropTypes.func,
    sendToApprove: PropTypes.func,
    createConversation: PropTypes.func,
    createMessage: PropTypes.func,
    showNotification: PropTypes.func,
    showDefault: PropTypes.func,
    push: PropTypes.func,
    setMapParams: PropTypes.func,
    clearMapDirections: PropTypes.func,
    closePopup: PropTypes.func,
    setStatus: PropTypes.func,
    updateProduct: PropTypes.func,
    updateProducts: PropTypes.func,
    product: PropTypes.object,
    location: PropTypes.object,
    user: PropTypes.object,
    coordinates_pointB: PropTypes.object,
    map: PropTypes.object,
    errors: PropTypes.object,
    loading: PropTypes.bool,
    activation_loading: PropTypes.bool,
    conv_loading: PropTypes.bool,
    loading_message: PropTypes.bool,
    hidePanel: PropTypes.bool,
    productId: PropTypes.number,
    // conversation: PropTypes.object,
    friendly: PropTypes.array,
    included: PropTypes.array,
    nearby: PropTypes.array,
    offered: PropTypes.array,
    addToFavorite: PropTypes.func,
    removeFavorite: PropTypes.func,
    showAuth: PropTypes.func,
    showEmail: PropTypes.func,
    addViewedPost: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      report_modal_is_opened: false,
      message_modal_is_opened: false,
      rent_modal_is_opened: false,
      success_modal_is_opened: false,
      email_modal_is_opened: false,
      feedback_modal_is_opened: false
    };

    this.handleActivate = ::this.handleActivate;
    this.handleDeactivate = ::this.handleDeactivate;
    this.handleSendToApprove = ::this.handleSendToApprove;
    this.showModal = ::this.showModal;
    this.hideModal = ::this.hideModal;
    this.sendMessage = ::this.sendMessage;
    this.showMessageModal = ::this.showMessageModal;
    this.showRentModal = ::this.showRentModal;
    this.showReportModal = ::this.showReportModal;
  }

  componentDidMount() {
    // popup. from products container
    const id = this.props.productId;
    if (id) this.props.load(id);
    if (!!this.props.product && !!this.props.product.id) {
      this.props.addViewedPost(this.props.product.id);
    }
    // console.log(this.props.favorites);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.product !== nextProps.product && !!nextProps.product && !!this.props.product) {
      this.props.addViewedPost(nextProps.product.id);
    }
  }

  sendMessage(text) {
    const {user, product} = this.props;
    return new Promise((resolve, reject_promise) => {
      this.props.createConversation({name: product.title, user_id: product.owner.id}).then((r) => {
        this.props.createMessage(r.conversation.id, {message: {body: text, id: user.id}}).then((resp) => {
          this.hideModal('message_modal_is_opened');
          this.props.showNotification('message_success', {text: 'Your message has been sent', type: 'success'});
          return resolve(resp);
        }, (err) => reject_promise(err));
      }, (err) => reject_promise(err));
    });
  }

  handleActivate() {
    const { product } = this.props;
    if (product) {
      return this.props.activate(product.id, product.post_type);
    }
    return Promise.reject();
  }

  handleSendToApprove() {
    const { product } = this.props;
    if (product) {
      return this.props.sendToApprove(product.id);
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

  showRentModal() {
    const { user } = this.props;
    if (user && user.email_present) {
      this.showModal('rent_modal_is_opened');
    } else if (user) {
      this.props.showEmail(() => this.showModal('rent_modal_is_opened'));
    } else {
      this.props.showAuth(() => this.showModal('rent_modal_is_opened'));
    }
  }

  showReportModal() {
    const { user } = this.props;
    if (user && user.email_present) {
      this.showModal('report_modal_is_opened');
    } else if (user) {
      this.props.showEmail(() => this.showModal('report_modal_is_opened'));
    } else {
      this.props.showAuth(() => this.showModal('report_modal_is_opened'));
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

  selectFurniture(furniture) {
    switch (furniture) {
      case 1:
        return 'Included';
      case 0:
        return 'Not included';
      default:
        return 'Any';
    }
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
    const {
      user,
      coordinates_pointB,
      location,
      map,
      setMapParams,
      clearMapDirections,
      closePopup,
      friendly,
      included,
      nearby,
      offered,
    } = this.props;

    const product = this.props.product || {};

    const is_favorite = !!product.id && !!offered.find(c => c === product.id);

    const friendly_products = product.tag_list ? product.tag_list.filter(c => friendly.find(item => item.name === c)) || [] : [];
    const included_products = product.tag_list ? product.tag_list.filter(c => included.find(item => item.name === c)) || [] : [];
    const nearby_products = product.tag_list ? product.tag_list.filter(c => nearby.find(item => item.name === c)) || [] : [];

    const description = truncString(product.description, 200);
    const title = `Viemate - ${product.title}`;

    const isAdmin = user && user.admin;
    // const ownerOrAdmin = user && product.owner && (user.id === product.owner.id || user.admin);
    const ownPost = user && product.owner && user.id === product.owner.id;
    const hidePanel = this.props.hidePanel || product.status === 'initialization';

    let coordinates;
    if (product.latitude) {
      coordinates = {
        lat: product.latitude,
        lng: product.longitude
      };
    }
    // console.log('PROPS', this.props);
    // console.log('COORDINATES_POINTB', coordinates_pointB);
    // console.log('TRAVEL_MODE', this.state.map_travel_mode);

    if (this.props.loading) return <Loader />;

    return (
      <div className={'product-details' + (hidePanel ? ' product-details--no-panel' : '')}>
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
          <div className="product-details__user-profile product-details__user-profile--offered">
            <ProductProfile
              profile={product.owner}
              openModal={() => this.showMessageModal()}
              ownPost={ownPost}
              message={title}
              showModal={this.showModal}
              productNavBtn={ownPost &&
                <ProductNavBtn postId={product.id} />}
            />
            {!ownPost && <ProductAction message={title} showModal={this.showModal} showRentModal={this.showRentModal} showReportModal={this.showReportModal} />}
          </div>}
        <div className="product-details__offer">
          <div className="product-details__offer-wrapper">
            <ProductHeader
              is_favorite={is_favorite}
              toggleFavorite={is_favorite ? () => this.props.removeFavorite(product.id, 'offered') : () => this.props.addToFavorite(product.id, 'offered')}
              header={product.title}
              price={product.price}
              rentalPeriod="Per month" typeBill="$"
            />
            {!!product.attachments && !!product.attachments.length &&
              <ProductSlider
                slides={product.attachments}
              />}
            <ProductOptions
              dateRentFrom={`${moment(product.start_date).format('DD MMMM, YYYY')}`}
              dateRentTo={`${moment(product.end_date).format('DD MMMM, YYYY')}`}
              roomType={this.selectPlaceType(product.place_type)}
              location={product.neighbourhood || '-'}
              leaseTypes={this.selectLeaseTypes(product)}
              furniture={this.selectFurniture(product.furnished)}
              gender={this.selectGender(product.gender)}
              ownPost={ownPost}
            />
            {friendly_products.length > 0 && <ProductTags titleTag={`FRIENDLY — ${friendly_products.length}`} tags={friendly_products} />}
            {included_products.length > 0 && <ProductTags titleTag={`Included — ${included_products.length}`} tags={included_products} />}
            {nearby_products.length > 0 && <ProductTags titleTag={`Nearby — ${nearby_products.length}`} tags={nearby_products} />}
            <ProductDescription descriptionProduct={product.description} />
            {!!coordinates &&
              <Map
                scrollwheel={false}
                defaultCenter={coordinates}
                markers={isAdmin && [coordinates]}
                circles={!isAdmin && [coordinates]}
                defaultZoom={15}
                zoomControl
                pointB={coordinates_pointB}
                directions={map.directions}
                directions_markers={map.directions_markers}
                hide_init_markers={map.hide_init_markers}
                travel_mode={map.travel_mode}
                setParams={setMapParams}
              >
                <MapForm
                  coordinates={coordinates}
                  directions_loading={map.directions_loading}
                  travel_mode={map.travel_mode}
                  travel_time={map.travel_time}
                  setParams={setMapParams}
                  clearDirections={clearMapDirections}
                  pointB={coordinates_pointB}
                />
              </Map>}
            {ownPost && hidePanel &&
              <ProductNavBtn
                postId={product.id}
                status={product.status}
                activate={this.handleActivate}
                sendToApprove={this.handleSendToApprove}
                activation_loading={this.props.activation_loading}
                push={this.props.push}
                showDefault={this.props.showDefault}
                closePopup={closePopup}
                setStatus={this.props.setStatus}
                buttonsBottom={hidePanel}
              />}
            {isAdmin &&
              <ProductAdminBtn
                activate={this.handleActivate}
                showFeedBack={() => this.showModal('feedback_modal_is_opened')}
                status={product.status}
                activation_loading={this.props.activation_loading}
                setStatus={this.props.setStatus}
                updateProduct={this.props.updateProduct}
                updateProducts={this.props.updateProducts}
                postType={product.post_type}
                postId={product.id}
              />}
          </div>
        </div>

        <Modal
          className="modal--report"
          handleClose={() => this.hideModal('report_modal_is_opened')}
          opened={this.state.report_modal_is_opened}
          innerButtonClose
        >
          <ReportPost id={product.id} />
        </Modal>
        <Modal
          className="modal--new-message"
          handleClose={() => this.hideModal('message_modal_is_opened')}
          opened={this.state.message_modal_is_opened}
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
        <Modal
          className="modal--rent-place"
          handleClose={() => this.hideModal('rent_modal_is_opened')}
          opened={this.state.rent_modal_is_opened}
          innerButtonClose
        >
          <ConfirmRent showModal={this.showModal} hideModal={this.hideModal} product={product} price={parseFloat(`${product.price || 0}`.replace(',', ''))} />
        </Modal>
        <Modal
          className="modal--success"
          handleClose={() => this.hideModal('success_modal_is_opened')}
          opened={this.state.success_modal_is_opened}
          innerButtonClose
        >
          <SuccessRentPost showModal={this.showModal} hideModal={this.hideModal} />
        </Modal>
        {isAdmin &&
          <Modal
            className="modal--feedback modal--product-no-panel"
            handleClose={() => this.hideModal('feedback_modal_is_opened')}
            opened={this.state.feedback_modal_is_opened}
            innerButtonClose
          >
            <Feedback deactivate={this.handleDeactivate} setStatus={this.props.setStatus} updateProduct={this.props.updateProduct} updateProducts={this.props.updateProducts} toggleFeedbackModal={() => this.hideModal('feedback_modal_is_opened')} errors={this.props.errors} />
          </Modal>
        }
      </div>
    );
  }
}
