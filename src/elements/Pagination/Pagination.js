import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import {} from './Pagination.scss'; // eslint-disable-line

const generateArray = (length) => new Array(...Array(length - 2)).map((c, i) => i + 2);

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
    this.pages = props.pages > 2 ? generateArray(props.pages) : [];
    this.slideNext = ::this.slideNext;
    this.slidePrev = ::this.slidePrev;
  }

  componentDidMount() {
    this.setInitialPage(this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.pages !== next.pages) this.pages = next.pages > 2 ? generateArray(next.pages) : [];
    if (next.selectedPage) {
      if (next.selectedPage !== this.props.selectedPage) this.setInitialPage(next); //eslint-disable-line
    } else {
      if (this.props.location !== next.location) this.setInitialPage(next); //eslint-disable-line
    }
  }

  setInitialPage(props) {
    const {location: {query}, pages, pagesRange, selectedPage} = props;
    const page = (selectedPage || parseFloat(query.page)) || 1;
    const margin_l = Math.ceil((pagesRange - 1) / 2);
    const margin_r = Math.floor((pagesRange - 1) / 2);
    if (pagesRange >= pages - 2) {
      this.setState({slice_from: 0, slice_to: pagesRange});
    } else if (page <= pagesRange) {
      this.setState({slice_from: 0, slice_to: pagesRange});
    } else if (page > pagesRange && page < pages - pagesRange) {
      this.setState({slice_from: page - 2 - margin_l, slice_to: (page - 1) + margin_r});
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
    if (slice_to + pagesRange >= this.pages.length) {
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
    const url = (number) => ({pathname, query: {...query, page: number}});
    // const current_page = query && query.page ? query.page : 1;
    return (
      <nav className="pagination">
        <ul className={containerClassName}>
          <li ref={n => this.element = n} className={classnames('pagination__item', {[cssClassName]: !!cssClassName}, {active: page === 1})}>
            <Link to={url(1)} className={linkClassName}>1</Link>
          </li>
          {
            slice_from > 0 &&
            <li className={classnames('pagination__item', {[cssClassName]: !!cssClassName})}>
              <a href="#" className={linkClassName} onClick={this.slidePrev}>...</a>
            </li>
          }
          {
            this.pages.length > 0 && this.pages.slice(slice_from, slice_to).map((c) =>
              <li key={c} className={classnames('pagination__item', {[cssClassName]: !!cssClassName}, {active: page === c})}>
                <Link to={url(c)} onClick={(e) => this.handlePage(c, e)} className={linkClassName}>{c}</Link>
              </li>
            )
          }
          {
            slice_to < this.pages.length &&
            <li className={classnames('pagination__item', {[cssClassName]: !!cssClassName})}>
              <a href="#" className={linkClassName} onClick={this.slideNext}>...</a>
            </li>
          }
          {
            pages >= 2 &&
            <li className={classnames('pagination__item', {[cssClassName]: !!cssClassName}, {active: page === pages})}>
              <Link to={url(pages)} className={linkClassName}>{pages}</Link>
            </li>
          }
        </ul>
      </nav>
    );
  }
}


// import React, { Component } from 'react';
// import { Link } from 'elements';
// import {} from './Pagination.scss'; // eslint-disable-line

// export default class Pagination extends Component {
//   render() {
//     return (
//       <nav className="pagination">
//         <ul className="pagination__list">
//           <li className="pagination__item">
//             <Link to="/" className="pagination__item-link pagination__item-prev">
//               <i className="icon icon--next-nav" />
//             </Link>
//           </li>
//           <li className="pagination__item">
//             <Link to="/" className="pagination__item-link">
//               1
//             </Link>
//           </li>
//           <li className="pagination__item">
//             <Link to="/" className="pagination__item-link">
//               2
//             </Link>
//           </li>
//           <li className="pagination__item">
//             <Link to="/" className="pagination__item-link">
//               3
//             </Link>
//           </li>
//           <li className="pagination__item">
//             <Link to="/" className="pagination__item-link">
//               4
//             </Link>
//           </li>
//           <li className="pagination__item">
//             <Link to="/" className="pagination__item-link pagination__item-next">
//               <i className="icon icon--prev-nav" />
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     );
//   }
// }
