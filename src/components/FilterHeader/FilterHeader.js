import React, { Component, PropTypes } from 'react';
import {} from './FilterHeader.scss';
import { Form } from 'elements';
import moment from 'moment';

export default class FilterHeader extends Component {
  static propTypes = {
    toggleFiltersModal: PropTypes.func,
    clearFilter: PropTypes.func,
    clearAll: PropTypes.func,
    changeMobileView: PropTypes.func,
    filters: PropTypes.object,
    map_view: PropTypes.bool,
    hideMapBtn: PropTypes.bool,
    hide_current_filter: PropTypes.bool,
  };

  selectFurniture(furniture) {
    switch (furniture) {
      case 1:
        return 'Included';
      case 0:
        return 'Not included';
      default:
        return '';
    }
  }

  selectLeaseType(type) {
    switch (type) {
      case 'lease_type_temporary':
        return 'Temporary sublet';
      case 'lease_type_take_over':
        return 'Lease takeover';
      default:
        return '';
    }
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

  renderLabels(name, value) {
    switch (name) {
      case 'price':
        if (value.from <= 0) return `to $${value.to.toLocaleString()}`;
        if (value.to >= 10000) return `from $${value.from.toLocaleString()}`;
        return `$${value.from.toLocaleString()} - $${value.to.toLocaleString()}`;
      case 'dates':
        return `${moment(value.start_date, 'YYYY-MM-DD').format('D MMMM')} - ${moment(value.end_date, 'YYYY-MM-DD').format('D MMMM')}`;
      case 'place_type':
        return this.selectPlaceType(value);
      case /lease_type/:
        return this.selectLeaseType(name);
      case 'gender':
        return this.selectGender(value);
      default:
        return this.renderCheckboxes(name);
    }
  }

  renderCheckboxes(name) {
    switch (true) {
      case /lease_type/.test(name):
        return this.selectLeaseType(name);
      case /friendly_/.test(name):
        return `Friendly ${name.replace(/friendly_/, '')}`;
      case /included_/.test(name):
        return `Included ${name.replace(/included_/, '')}`;
      default:
        return `${name}`;
    }
  }

  render() {
    const { filters, changeMobileView, map_view, hideMapBtn, hide_current_filter } = this.props;
    const filteredFilters = filters ? Object.keys(filters).filter(c => c !== 'location') : [];
    // console.log(filters);

    return (
      <div className="filter-header">
        <div className="filter-header__wrapper-container">
          <div className="container--desktop-width container table">
            <div className="filter-header__nav">
              <div className="filter-header__nav-item">
                <Form.Button
                  className="form-button--default-dark form-button--filters"
                  onClick={() => this.props.toggleFiltersModal()}
                  disabled={false}
                  type="button"
                >
                  <span>Filters</span>
                </Form.Button>
              </div>
              <div className="filter-header__nav-item filter-header__nav-item--btn-grid">
                {!hideMapBtn &&
                  <Form.Button
                    className="form-button--default-dark form-button--views"
                    type="button"
                    onClick={changeMobileView}
                  >
                    <span>{map_view ? 'Grid view' : 'Map view'}</span>
                  </Form.Button>
                }
              </div>
            </div>
            {!hide_current_filter &&
            <div className="filter-header__manage">
              <div className="filter-header__selected">
                {filteredFilters.map((c, i) =>
                  <div key={i} className="filter-header__selected-item">
                    <Form.Button
                      className="form-button--default form-button--selected"
                      // onClick={() => {}}
                      disabled={false}
                      type="button"
                    >
                      <span>
                        {this.renderLabels(c, filters[c])}
                        <i className="icon icon--close" onClick={() => this.props.clearFilter(c)} />
                      </span>
                    </Form.Button>
                  </div>
                )}
              </div>
              <div className="filter-header__btn-clear-filters">
                {!!filteredFilters.length &&
                  <Form.Button
                    className="form-button form-button--clear form-button--clear-filters"
                    onClick={() => this.props.clearAll()}
                    disabled={false}
                    type="button"
                  >
                    <span>Clear all filters</span>
                  </Form.Button>}
              </div>
            </div>
          }
          </div>
        </div>
      </div>
    );
  }

}
