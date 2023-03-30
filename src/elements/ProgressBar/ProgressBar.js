import React, { PropTypes } from 'react';
import cx from 'classnames';
import {} from './ProgressBar.scss';

function renderDots() {
  return (
    <div className="progress-bar__text-dots">
      <div className="progress-bar__text-dot progress-bar__text--dot1">.</div>
      <div className="progress-bar__text-dot progress-bar__text--dot2">.</div>
      <div className="progress-bar__text-dot progress-bar__text--dot3">.</div>
    </div>
  );
}

function ProgressBar(props) {
  const { className, progress, uploadingText, uploadedText, dots } = props;
  // console.log(progress);

  if (!progress) return null;

  const innerBarStyles = {
    transform: `scaleX(${progress / 100})`
  };

  return (
    <div className={cx('progress-bar', {[className]: className})}>
      {uploadingText && progress !== 100 &&
        <div className="progress-bar__text">{uploadingText}{dots && renderDots()}</div>}
      {uploadedText && progress === 100 &&
        <div className="progress-bar__text">{uploadedText}{dots && renderDots()}</div>}
      <div className="progress-bar__progress" style={innerBarStyles} />
    </div>
  );
}
ProgressBar.propTypes = {
  className: PropTypes.string,
  uploadingText: PropTypes.string,
  uploadedText: PropTypes.string,
  progress: PropTypes.number,
  dots: PropTypes.bool
};

export default ProgressBar;
