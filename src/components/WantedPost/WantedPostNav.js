import React, { Component, PropTypes } from 'react';
import {} from './WantedPostNav.scss';

export default class PostNav extends Component {
  static propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number.isRequired,
    activePages: PropTypes.object,
    setPage: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool
  };

  static defaultProps = {
    pages: 2,
    page: 1
  };

  handleClick(pageToGo) {
    const { activePages, page, setPage } = this.props;
    if (activePages[pageToGo] && page !== pageToGo) setPage(pageToGo);
  }

  triggerSubmit() {
    const submitBtn = document.querySelector('[type="submit"]');

    if (!submitBtn.disabled) submitBtn.click();
  }

  render() {
    const { pages, page, activePages, pristine, submitting } = this.props;
    // +1 due to next button
    const percent = page !== 2 ? ((100 / (pages + 1)) * page) : 100;

    return (
      <div className={'post-nav wanted-post-nav' + (page === 2 ? ' post-nav--last-page' : '')}>
        <div className="post-nav__container">
          <span className="post-nav__steps">{`${page} of ${pages}`}</span>
          <ul className="list-unstyled post-nav__lists">
            <li className={'post-nav__item post-nav__item--first ' + (page === 1 ? 'is-active ' : '') + (activePages[1] ? 'post-nav__item--clickable' : '')}>
              <button className="form-button form-button--clear" type="button" onClick={() => this.handleClick(1)}>
                <span>
                  Basic info
                  <i className="icon icon--checked" />
                </span>
              </button>
            </li>
            <li className={'post-nav__item post-nav__item--third ' + (page === 2 ? 'is-active ' : '') + (activePages[2] ? 'post-nav__item--clickable' : '')}>
              <button className="form-button form-button--clear" type="button" onClick={() => this.handleClick(2)}>
                <span>
                  Tags
                  <i className="icon icon--checked" />
                </span>
              </button>
            </li>
            <li className="post-nav__item post-nav__item--fifth">
              <button
                className="form-button form-button--pink form-button--next-step"
                type="button"
                disabled={pristine || submitting}
                onClick={this.triggerSubmit}
              >
                <span>
                  Next
                </span>
              </button>
            </li>
          </ul>
        </div>
        <div className="post-nav__progress-bar progress">
          <div className="progress-bar" style={{ width: percent + '%' }} />
        </div>
      </div>
    );
  }
}
