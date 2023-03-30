import React, { Component, PropTypes } from 'react';
import {} from './UserOptions.scss';

export default class UserOptions extends Component {
  static propTypes = {
    location: PropTypes.string,
    period_from: PropTypes.string,
    period_to: PropTypes.string,
    roomType: PropTypes.string,
    leaseTypes: PropTypes.array,
    gender: PropTypes.any
  };

  render() {
    const { location, period_from, period_to, roomType, gender, leaseTypes } = this.props;

    return (
      <ul className="list-unstyled user-options">
        <li className="user-options__item">
          <span className="user-options__title">Looking for</span>
          <span className="user-options__option">{roomType}</span>
        </li>
        <li className="user-options__item">
          <span className="user-options__title">From</span>
          <span className="user-options__option"><span className="user-options__date--bold">From</span>{` ${period_from}`}</span>
          <span className="user-options__option"><span className="user-options__date--bold">To</span>{` ${period_to}`}</span>
        </li>
        <li className="user-options__item">
          <span className="user-options__title">Heighborhood</span>
          <span className="user-options__option">{location}</span>
        </li>
        {!!leaseTypes.length &&
          <li className="user-options__item">
            <span className="user-options__title">Lease type</span>
            {leaseTypes.map((c, i) => <span key={i} className="user-options__option">{c}</span>)}
          </li>}
        <li className="user-options__item">
          <span className="user-options__title">Gender</span>
          <span className="user-options__option">
            {gender}
          </span>
        </li>
      </ul>
    );
  }
}
