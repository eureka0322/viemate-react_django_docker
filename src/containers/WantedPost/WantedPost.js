import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from 'config';
import { WantedPost as WantedPostComponent, User } from 'components';
import { setBodyClassname, historyState, tagsToString } from 'utils/helpers';
import { reduxForm } from 'redux-form';
import { replace } from 'react-router-redux';
import { Modal } from 'elements';
import cookie from 'react-cookie';
import { addNew } from 'redux/modules/product';
import { showDefault } from 'redux/modules/notifications';
import locations from 'utils/available_cities';

@connect(
  state => ({
    user: state.auth.user,
    product: state.product.product,
    productLoading: state.product.loading,
    chosen_location: state.location.location,
    friendly: state.initialAppState.friendly,
    included: state.initialAppState.included,
    nearby: state.initialAppState.nearby,
  }), {
    addNewWanted: addNew,
    showDefault,
    replace,
  }
)
@reduxForm({
  form: 'form-wanted-post'
  // enableReinitialize: true
})
export default class WantedPost extends Component {
  static propTypes = {
    addNewWanted: PropTypes.func,
    initialize: PropTypes.func,
    // clearProduct: PropTypes.func,
    product: PropTypes.object,
    productLoading: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    chosen_location: PropTypes.string,
    friendly: PropTypes.array,
    included: PropTypes.array,
    nearby: PropTypes.array,
    user: PropTypes.object,
    showDefault: PropTypes.func,
    replace: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
    this.setDefaultActivePages();

    this.nextPage = ::this.nextPage;
    this.previousPage = ::this.previousPage;
    this.setPage = ::this.setPage;
    this.handleSubmit = ::this.handleSubmit;
    this.toggleProductModal = ::this.toggleProductModal;
  }

  componentWillMount() {
    const { user } = this.props;

    if (user && user.profile && !user.profile.avatar) {
      this.props.showDefault('message_no_avatar');
      this.props.replace('/');
    }
    const chosen_location = locations.find(c => c.value === this.props.chosen_location);
    this.props.initialize({ furnished: '', address: (!!chosen_location && chosen_location.value) || locations[0].value });
  }

  componentDidMount() {
    setBodyClassname('body-wanted-posts body-manage-posts');
  }

  setDefaultActivePages() {
    this.activePages = {
      1: true,
      2: false
    };
  }

  setPage(page) {
    this.setState({ page });
    this.scrollToTop();
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

  handleSubmit(data) {
    data = {
      ...data,
      start_date: this.formatDate(data.dates_range.startDate),
      end_date: this.formatDate(data.dates_range.endDate),
      // address: cookie.load('chosen_location')
    };
    delete data.dates_range;
    delete data.coordinates; // no coordinates needed

    data = tagsToString(data);

    // console.log('DATA_SUBMIT', data);
    this.props.addNewWanted(data, 'wanted')
      .then(r => {
        this.toggleProductModal(r.post.id);
      });
  }

  formatDate(date) {
    // convert moment object
    return date.format('YYYY-MM-DD');
  }

  toggleProductModal(id) {
    this.setState({
      product_modal_is_opened: !this.state.product_modal_is_opened,
    });
    historyState(id, 'product_opened', `${cookie.load('chosen_location')}/${id}`);
  }

  render() {
    return (
      <div>
        <Helmet {...config.app.head} />
        <div className="container--full-width container post-body post-body__container">
          <WantedPostComponent.WantedPostNav
            page={this.state.page}
            activePages={this.makePageActive(this.state.page)}
            setPage={this.setPage}
            pristine={this.props.pristine}
            submitting={this.props.submitting}
          />
        </div>
        <div className="container container--sm-width post-body post-body__content">
          <WantedPostComponent.WantedPostForm
            initialize={this.props.initialize}
            page={this.state.page}
            previousPage={this.previousPage}
            nextPage={this.nextPage}
            productLoading={this.props.productLoading}
            onSubmit={this.handleSubmit}
            locations={locations}
            friendly={this.props.friendly}
            included={this.props.included}
            nearby={this.props.nearby}
          />
        </div>

        <Modal
          className="modal--product modal--product-no-panel"
          handleClose={this.toggleProductModal}
          opened={this.state.product_modal_is_opened}
          disableClickClose
          disableClose
        >
          <User product={this.props.product} hidePanel />
        </Modal>
      </div>
    );
  }
}
