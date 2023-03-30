import React, { Component, PropTypes } from 'react';
import {} from './QuoteBlock.scss';
import classNames from 'classnames';

export default class QuoteBlock extends Component {
  static propTypes = {
    quoteTitle: PropTypes.string,
    quoteContent: PropTypes.string,
    className: PropTypes.string,
  };

  render() {
    const { quoteContent, quoteTitle, className } = this.props;
    return (

      <div className="container container--full-width container--bg-white quote-block">
        <div className="container container--lg-width">
          <div className={classNames('lazyload', 'quote-block__item quote-block__item--left', {[className]: !!className})}>
            <p className="quote-block__title">{quoteTitle}</p>
          </div>
          <div className={classNames('lazyload', 'quote-block__item quote-block__item--right', {[className]: !!className})}>
            <p className="quote-block__content">{quoteContent}</p>
          </div>
        </div>
      </div>
    );
  }

}
