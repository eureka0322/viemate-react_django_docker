import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import Helmet from 'react-helmet';
import config from 'config';
import {} from './ManagePost.scss';
import { Post as PostComponent, Product, NewAddress, LeaveBlock } from 'components';
import { Modal } from 'elements';
import { setBodyClassname, historyState, tagsToString, handlePageReload } from 'utils/helpers';
import { addNew, addAttach, load } from 'redux/modules/product';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router';
import { confirmLeave, confirmNeeded } from 'redux/modules/onLeave';

@connect(
  state => ({
    product: state.product.product,
    nearby: state.initialAppState.nearby,
    friendly: state.initialAppState.friendly,
    included: state.initialAppState.included,
    leave_confirmation: state.onLeave.confirmation,
  }), {
    addNewProduct: addNew,
    addProductAttach: addAttach,
    confirmLeave,
    confirmNeeded,
    load
  }
)
@reduxForm({
  form: 'form-manage-post',
  // enableReinitialize: true
})
@withRouter
export default class ManagePost extends Component {
  static propTypes = {
    addNewProduct: PropTypes.func,
    addProductAttach: PropTypes.func,
    initialize: PropTypes.func,
    change: PropTypes.func,
    confirmLeave: PropTypes.func,
    confirmNeeded: PropTypes.func,
    load: PropTypes.func,
    product: PropTypes.object,
    router: PropTypes.object,
    route: PropTypes.object,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    leave_confirmation: PropTypes.bool,
    nearby: PropTypes.array,
    friendly: PropTypes.array,
    included: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      custom_autocomplete: false,
      product_modal_is_opened: false,
      autocomp_modal_is_opened: false,
      confirmation_opened: false,
      next_location: null,
      progressArr: [0],
      curPercent: 0
    };
    this.tempProgressArr = [0];
    this._curPercent = 0;

    this.setDefaultActivePages();

    this.nextPage = ::this.nextPage;
    this.previousPage = ::this.previousPage;
    this.setPage = ::this.setPage;
    this.handleSubmit = ::this.handleSubmit;
    this.toggleProductModal = ::this.toggleProductModal;
    this.setAutocompleteState = ::this.setAutocompleteState;
    this.handleUpload = ::this.handleUpload;
    this.handleProgress = ::this.handleProgress;
    this.handleRouteLeave = ::this.handleRouteLeave;
    this.openConfirmModal = ::this.openConfirmModal;
    this.closeConfirmModal = ::this.closeConfirmModal;
    this.handleClearAndClose = ::this.handleClearAndClose;

    this._handlePageReload = handlePageReload.bind(this);
  }

  componentDidMount() {
    setBodyClassname('body-manage-posts');
    this.props.router.setRouteLeaveHook(this.props.route, this.handleRouteLeave);

    window.addEventListener('beforeunload', this._handlePageReload);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pristine && !nextProps.pristine) {
      this.props.confirmNeeded();
    }
    if (!this.props.pristine && nextProps.pristine) {
      this.props.confirmLeave();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this._handlePageReload);
    this.props.confirmLeave();
  }

  setDefaultActivePages() {
    this.activePages = {
      1: true,
      2: false,
      3: false,
      4: false
    };
  }

  setPage(page) {
    this.setState({ page });
    this.scrollToTop();
  }

  setAutocompleteState(state = {}) {
    this.setState(state);
  }

  nextPage(data) { // eslint-disable-line
    // console.log('DATA_NEXT', data);
    this.setState({ page: this.state.page + 1 });
    this.scrollToTop();
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
    this.scrollToTop();
  }

  makePageActive(page) {
    this.activePages[page] = true;
    return this.activePages;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  openConfirmModal() {
    this.setState({confirmation_opened: true});
  }

  closeConfirmModal() {
    this.setState({confirmation_opened: false});
  }

  handleRouteLeave(param) {
    this.setState({next_location: param});
    if (this.props.leave_confirmation) {
      this.openConfirmModal();
      return false;
    }
    return true;
  }

  handleClearAndClose() {
    this.props.confirmLeave().then(() => {
      this.closeConfirmModal();
      this.props.router.push({pathname: this.state.next_location.pathname, query: this.state.next_location.query});
    });
  }

  handleProgress(e, i) { // eslint-disable-line
    // clearTimeout(this._timer);
    const progressArr = [...this.tempProgressArr];

    progressArr[i] = e.percent || 100;
    this.tempProgressArr = progressArr;
    this._curPercent = Math.round(progressArr.reduce((t, c) => +t + +c, 0) / progressArr.length);

    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      if (this._curPercent !== this.state.curPercent) {
        this.setState({
          progressArr,
          curPercent: this._curPercent
        });
      }
    }, 50);

    // console.log(e);
  }

  handleUpload(postId, obj) {
    const promises = [];
    const files = obj.file;
    // fill temp progress array with empty values
    this.tempProgressArr = Array(...Array(files.length)).map(() => 0);

    files.forEach((c, i) => {
      promises.push(this.props.addProductAttach(postId, {
        file: [c],
        ...(obj.main === i ? {main: 'file_0'} : {})
      }, e => this.handleProgress(e, i)));
    });

    return Promise.all(promises);
  }

  handleSubmit(data) {
    const attach = data.photo;
    const coverIndex = data.preview_index;
    const uncompletedPost = !data.coordinates; // post is uncompleted if it has no coordinates due to selected custom autocomplete

    const addressData = data.address_data || {};
    const city = addressData.city && addressData.city.split(' ').join('-');
    const state = addressData.state;
    const country = addressData.country && addressData.country.split(' ').join('-');
    const addressFull = !!(city && state && country);

    const address = (addressFull && !uncompletedPost) ? `${city}--${state}--${country}` : (cookie.load('chosen_location') || 'Boston--MA--United-States');

    data = {
      ...{
        ...data,
        start_date: this.formatDate(data.dates_range.startDate),
        end_date: this.formatDate(data.dates_range.endDate),
        address
      },
      ...(data.coordinates ? {latitude: data.coordinates.lat} : {}),
      ...(data.coordinates ? {longitude: data.coordinates.lng} : {})
    };
    delete data.dates_range;
    delete data.coordinates;
    delete data.photo;
    delete data.preview_index;
    delete data.address_data;

    data = tagsToString(data, /lease_type_/);

    // console.log('DATA_SUBMIT', data);
    return this.props.addNewProduct(data, 'offered', uncompletedPost)
      .then(result => {
        this._id = result.post.id;
        return this.handleUpload(this._id, {file: attach, main: coverIndex});
      })
      .then(() => this.props.load(this._id))
      .then(() => this.props.confirmLeave())
      .then(() => this.toggleProductModal(this._id, address))
      .catch(err => console.log(err));
  }

  formatDate(date) {
    // convert moment object
    return date.format('YYYY-MM-DD');
  }

  toggleProductModal(id, address) {
    this.setState({
      product_modal_is_opened: !this.state.product_modal_is_opened,
    });
    historyState(id, 'product_opened', `${address}/${id}`);
  }

  render() {
    // console.log('PRODUCT', this.props.product);

    return (
      <div>
        <Helmet {...config.app.head} />
        <div className="container--full-width container post-body post-body__container">
          <PostComponent.PostNav
            page={this.state.page}
            activePages={this.makePageActive(this.state.page)}
            setPage={this.setPage}
            pristine={this.props.pristine}
            submitting={this.props.submitting}
          />
        </div>
        <div className="container container--sm-width post-body post-body__content">
          <PostComponent.PostForm
            onSubmit={this.handleSubmit}
            nextPage={this.nextPage}
            previousPage={this.previousPage}
            page={this.state.page}
            productLoading={this.props.submitting}
            initialize={this.props.initialize}
            custom_autocomplete={this.state.custom_autocomplete}
            setAutocompleteState={this.setAutocompleteState}
            nearby={this.props.nearby}
            friendly={this.props.friendly}
            included={this.props.included}
            progress={this._curPercent}
          />
        </div>

        <Modal
          className="modal--product modal--product-no-panel modal--preview product-details__preview"
          handleClose={this.toggleProductModal}
          opened={this.state.product_modal_is_opened}
          disableClickClose
          disableClose
        >
          <Product product={this.props.product} hidePanel />
        </Modal>
        <Modal
          className="modal--new-address"
          handleClose={() => this.setAutocompleteState({autocomp_modal_is_opened: false})}
          opened={this.state.autocomp_modal_is_opened}
          innerButtonClose
        >
          <NewAddress
            changeForm={this.props.change}
            setAutocompleteState={this.setAutocompleteState}
          />
        </Modal>
        <Modal
          className="modal--save-block"
          handleClose={this.closeConfirmModal}
          opened={this.state.confirmation_opened}
        >
          <LeaveBlock
            handleLeave={this.handleClearAndClose}
            handleStay={this.closeConfirmModal}
          />
        </Modal>
      </div>
    );
  }
}
