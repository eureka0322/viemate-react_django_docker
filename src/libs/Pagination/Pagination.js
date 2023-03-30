import React, {Component, PropTypes} from 'react';
import {SlickSlider} from 'components'; //eslint-disable-line
import {Link} from 'react-router';
import classnames from 'classnames';

const generateArray = (length) => {
  const array = [];
  for (let i = 0; i < length - 2; i++) {
    array.push(i + 2);
  }
  return array;
};

export default class Pagination extends Component {
  static propTypes = {
    location: PropTypes.object,
    pages: PropTypes.number,
    containerClassName: PropTypes.string,
    cssClassName: PropTypes.string,
    linkClassName: PropTypes.string,
    pagesRange: PropTypes.number,
    clickCallback: PropTypes.func,
    selectedPage: PropTypes.number,
  }

  static defaultProps = {
    pagesRange: 3,
  }

  constructor(props) {
    super(props);
    this.state = {
      slice_from: 0,
      slice_to: props.pagesRange,
    };
    this.pages = generateArray(props.pages);
  }

  componentDidMount() {
    this.setInitialPage(this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.pages !== next.pages) this.pages = generateArray(next.pages);
    if (next.selectedPage) {
      if (next.selectedPage !== this.props.selectedPage) this.setInitialPage(next);
    } else {
      if (this.props.location !== next.location) this.setInitialPage(next);
    }
  }

  setInitialPage(props) {
    const {location: {query}, pages, pagesRange, selectedPage} = props;
    const page = selectedPage ? selectedPage : parseFloat(query.page) || 1;
    const margin_l = Math.ceil((pagesRange - 1) / 2);
    const margin_r = Math.floor((pagesRange - 1) / 2);
    if (page <= pagesRange) {
      this.setState({slice_from: 0, slice_to: pagesRange});
    } else if (page > pagesRange && page < pages - pagesRange) {
      this.setState({slice_from: page - 2 - margin_l, slice_to: page - 1 + margin_r});
    } else if (page + pagesRange >= pages) {
      this.setState({slice_from: pages - 2 - pagesRange, slice_to: pages - 2});
    }
  }

  handlePage(page, e) {
    e.preventDefault();
    this.props.clickCallback(page);
  }

  slideNext(e) {
    e.preventDefault();
    const {pagesRange} = this.props;
    const {slice_from, slice_to} = this.state;
    if (slice_to + pagesRange >= this.pages.length - 1) {
      this.setState({slice_from: this.pages.length - pagesRange, slice_to: this.pages.length});
    } else {
      this.setState({slice_from: slice_from + pagesRange, slice_to: slice_to + pagesRange});
    }
  }

  slidePrev(e) {
    e.preventDefault();
    const {pagesRange} = this.props;
    const {slice_from, slice_to} = this.state;
    if (slice_from - pagesRange <= 0) {
      this.setState({slice_from: 0, slice_to: pagesRange});
    } else {
      this.setState({slice_from: slice_from - pagesRange, slice_to: slice_to - pagesRange});
    }
  }

  render() {
    const {
      location: {pathname, query},
      pages,
      containerClassName,
      cssClassName,
      linkClassName,
      selectedPage
    } = this.props;
    const {slice_from, slice_to} = this.state;
    const page = selectedPage || parseFloat(query.page) || 1;
    const url = (number) => ({pathname: pathname, query: {...query, page: number}});
    // const current_page = query && query.page ? query.page : 1;
    return (
      <div className={containerClassName}>
        <div ref={n => this.element = n} className={classnames('pagination__item', {[cssClassName]: !!cssClassName}, {active: page === 1})}>
          <Link to={url(1)} className={linkClassName}>1</Link>
        </div>
        {
          slice_from > 0 &&
          <div className={classnames('pagination__item', {[cssClassName]: !!cssClassName})}>
            <a href="#" className={linkClassName} onClick={::this.slidePrev}>...</a>
          </div>
        }
        {
          this.pages.length > 0 && this.pages.slice(slice_from, slice_to).map((c) =>
            <div key={c} className={classnames('pagination__item', {[cssClassName]: !!cssClassName}, {active: page === c})}>
              <Link to={url(c)} onClick={(e) => this.handlePage(c, e)} className={linkClassName}>{c}</Link>
            </div>
          )
        }
        {
          slice_to < this.pages.length - 1 &&
          <div className={classnames('pagination__item', {[cssClassName]: !!cssClassName})}>
            <a href="#" className={linkClassName} onClick={::this.slideNext}>...</a>
          </div>
        }
        {
          pages >= 2 &&
          <div className={classnames('pagination__item', {[cssClassName]: !!cssClassName}, {active: page === pages})}>
            <Link to={url(pages)} className={linkClassName}>{pages}</Link>
          </div>
        }
      </div>
    );
  }
}
