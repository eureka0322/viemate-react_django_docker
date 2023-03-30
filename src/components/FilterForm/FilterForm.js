import React, { Component, PropTypes } from 'react';
import {} from './FilterForm.scss';
import { Form } from 'elements';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';

const iconClose = require('./close.svg');

const renderRadio = field =>
  <Form.Radio
    field={field}
    {...field}
  />;

const renderCheckbox = field =>
  <Form.Checkbox
    field={field}
    use_num
    {...field}
  />;

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

@connect(state => ({
  tags: state.initialAppState.tags,
  friendly: state.initialAppState.friendly,
  included: state.initialAppState.included,
  nearby: state.initialAppState.nearby,
  form_values: getFormValues('form-filter')(state) || {}
}), {})

@reduxForm({
  form: 'form-filter',
  enableReinitialize: true
})

export default class FilterForm extends Component {
  static propTypes = {
    filters: PropTypes.object,
    pagination: PropTypes.object,
    setFilters: PropTypes.func,
    changeFilters: PropTypes.func,
    clearFilter: PropTypes.func,
    // allowed_filters: PropTypes.object,

    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    error: PropTypes.string,
    // errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    // reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    // valid: PropTypes.bool.isRequired,
    toggleFiltersModal: PropTypes.func,
    change: PropTypes.func,
    dispatch: PropTypes.func,
    form_values: PropTypes.object,
    //tags
    // tags: PropTypes.array,
    friendly: PropTypes.array,
    included: PropTypes.array,
    nearby: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      default_filters: {...(props.filters || {})}
    };
    this.changeForm = ::this.changeForm;
    this.handleSubmit = ::this.handleSubmit;
    this.updateFilters = ::this.updateFilters;
    this.updateAllFilters = ::this.updateAllFilters;
    this.handleCancel = ::this.handleCancel;
    this.clearDates = ::this.clearDates;
  }

  componentDidMount() {
    const {filters, initialize} = this.props;
    if (filters) {
      let initial_values = {...filters};
      if (filters.dates) {
        initial_values = {
          ...filters,
          dates: {
            startDate: moment(filters.dates.start_date, 'YYYY-MM-DD'),
            endDate: moment(filters.dates.end_date, 'YYYY-MM-DD'),
          }
        };
      }
      initialize(initial_values);
      this.setState({default_filters: {...filters}}); //eslint-disable-line
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.form_values !== nextProps.form_values) {
      const current = this.props.form_values;
      const next = nextProps.form_values;
      // if (current.place_type !== next.place_type) {
      //   this.updateFilters(next.place_type, 'place_type');
      // }
      if (current.price !== next.price) {
        clearTimeout(this.price_timer);
        this.price_timer = setTimeout(() => this.updateFilters(next.price, 'price'), 250);
      } else if (current.dates === next.dates) {
        this.updateAllFilters(next);
      }
      // if (current.gender !== next.gender) {
      //   this.updateFilters(next.gender, 'gender');
      // }
      // if (current.lease_type !== next.lease_type) {
      //   this.updateFilters(next.lease_type, 'lease_type');
      // }
    }
  }

  componentWillUnmount() {
    if (JSON.stringify(this.props.filters) !== JSON.stringify(this.state.default_filters)) {
      this.props.changeFilters({...this.state.default_filters});
    }
  }

  handleSubmit(data) {
    Object.keys(data).forEach(c => {
      if (data[c] === 0) {
        data[c] = false;
      } else if (data[c] === 1) {
        data[c] = true;
      }
    });
    let dates = {};
    if (data.dates) {
      dates = {dates: {start_date: data.dates.startDate.format('YYYY-MM-DD'), end_date: data.dates.endDate.format('YYYY-MM-DD')}};
    }
    this.props.setFilters({...data, ...dates}).then((f) => {
      this.setState({default_filters: {...f}}, () => {
        this.props.toggleFiltersModal();
      });
    });
  }

  updateFilters(val, field) {
    if (field === 'dates' && val) {
      if (val.startDate && val.endDate) {
        this.props.setFilters({dates: {start_date: val.startDate.format('YYYY-MM-DD'), end_date: val.endDate.format('YYYY-MM-DD')}});
      }
    } else {
      this.props.setFilters({[field]: val});
    }
  }

  updateAllFilters(data) {
    Object.keys(data).forEach(c => {
      if (data[c] === 0) {
        data[c] = false;
      } else if (data[c] === 1) {
        data[c] = true;
      }
    });
    let dates = {};
    if (data.dates) {
      dates = {dates: {start_date: data.dates.startDate.format('YYYY-MM-DD'), end_date: data.dates.endDate.format('YYYY-MM-DD')}};
    }
    this.props.setFilters({...data, ...dates});
  }

  changeForm(field, value) {
    this.props.dispatch(this.props.change(field, value));
  }

  clearDates() {
    this.props.change('dates', false);
    this.props.clearFilter('dates');
  }

  handleCancel() {
    if (JSON.stringify(this.props.filters) !== JSON.stringify(this.state.default_filters)) {
      return this.props.changeFilters({...this.state.default_filters}).then(() => this.props.toggleFiltersModal());
    }
    return this.props.toggleFiltersModal();
  }

  render() {
    const { handleSubmit, error, pristine, submitting, filters, pagination, friendly, included, nearby, form_values } = this.props;
    // console.log(allowed_filters);
    const is_clear = Object.keys(filters).length < 1 || (Object.keys(filters).length === 1 && filters.location);
    return (
      <form className="filter-form" action="" method="post" onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="filter-form__inner-scroll">
          <div className="filter-form__scroll-wrapper">
            <div className="filter-form__header">Filters</div>
            {pagination && !is_clear &&
              <div className="filter-form__title">{`${pagination.total_objects} apartment${pagination.total_objects !== 1 ? 's' : ''}`}</div>
            }
            <div className="filter-form__section">
              <div className="filter-form__label">What dates?</div>
              <div className="filter-form__container">
                <Form.DateRangePicker
                  className="date-range-picker--filters"
                  name="dates"
                  numberOfMonths={1}
                  startDateId="start_date"
                  endDateId="end_date"
                  minimumNights={30}
                  cbFunction={(val) => this.updateFilters(val, 'dates')}
                  // isDayBlocked={(param) => !moment(param).isBetween(allowed_filters.start_date, allowed_filters.end_date)}
                  moveToFocus
                  // showClearDates
                />
                {!!form_values && !!form_values.dates && <button onClick={this.clearDates} className="filter-form__btn-closed"><img src={iconClose} width={30} height={30} alt="Close" /></button>}
              </div>
            </div>
            <div className="filter-form__section filter-form__section--type-rooms">
              <div className="filter-form__label filter-form__label--type-rooms-label">How do you want <br /> to live?</div>
              <div className="filter-form__container">
                <div className="form-radio__group filter-form__wrapper-element">
                  <Field
                    classNameIcon="form-radio__icon form-radio__icon--pink"
                    classNameCaption="form-radio__label form-radio__label--caption"
                    classNameLabel="form-radio__label"
                    name="place_type"
                    type="radio"
                    component={renderRadio}
                    label="Entire apartment"
                    caption="If you are renting an entire apartment e.g. studio"
                    value="entire_apt"
                    disabled={submitting}
                  />
                  <Field
                    classNameIcon="form-radio__icon form-radio__icon--pink"
                    classNameCaption="form-radio__label form-radio__label--caption"
                    classNameLabel="form-radio__label"
                    name="place_type"
                    type="radio"
                    component={renderRadio}
                    label="Private room"
                    caption="If you are renting a room in a shared apartment/house."
                    value="private_room"
                    disabled={submitting}
                  />
                  <Field
                    classNameIcon="form-radio__icon form-radio__icon--pink"
                    classNameCaption="form-radio__label form-radio__label--caption"
                    classNameLabel="form-radio__label"
                    name="place_type"
                    type="radio"
                    component={renderRadio}
                    label="Shared room"
                    caption="If you are renting a shared bedroom."
                    value="shared_room"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
            <div className="filter-form__section filter-form__section--range">
              <div className="filter-form__label filter-form__label--range-label">Price range</div>
              <div className="filter-form__container">
                <div className="filter-form__price-range">
                  <Form.InputRange
                    minValue={0}
                    maxValue={10000}
                    values={{
                      min: (filters.price && filters.price.from) || 0,
                      max: (filters.price && filters.price.to <= 10000 && filters.price.to) || 10000,
                    }}
                    step={100}
                    min_name={'price.from'}
                    max_name={'price.to'}
                    changeForm={this.changeForm}
                    min_max_any
                  />
                </div>
              </div>
            </div>
            <div className="filter-form__section filter-form__section--select-gender">
              <div className="filter-form__label filter-form__label--select-label">Preferred gender</div>
              <div className="filter-form__container">
                <div className="select-custom select--gender-filter">
                  <Field
                    disabled={submitting}
                    name="gender"
                    list={[{ value: 'any', label: 'Any' }, { value: 'male', label: 'Men' }, { value: 'female', label: 'Women' }]}
                    type="checkbox"
                    placeholder="Any"
                    component={renderSelectbox}
                    defaultLabel="Any"
                  />
                </div>
              </div>
            </div>
            <div className="filter-form__section filter-form__section--checkbox-group">
              <div className="filter-form__label filter-form__label--checkbox-group-label">Lease type</div>
              <div className="filter-form__container">
                <div className="form-checkbox__checkbox-group filter-form__wrapper-element">
                  <Field
                    classNameIcon="form-checkbox__icon form-checkbox__icon--pink"
                    classNameCaption="form-checkbox__label form-checkbox__label--caption"
                    classNameLabel="form-checkbox__label"
                    disabled={submitting}
                    name="lease_type_temporary"
                    type="checkbox"
                    component={renderCheckbox}
                    label="Temporary sublet"
                    caption="If you are leaving the city for few vacation."
                  />
                  <Field
                    classNameIcon="form-checkbox__icon form-checkbox__icon--pink"
                    classNameCaption="form-checkbox__label form-checkbox__label--caption"
                    classNameLabel="form-checkbox__label"
                    disabled={submitting}
                    name="lease_type_take_over"
                    type="checkbox"
                    component={renderCheckbox}
                    label="Lease takeover"
                    caption="If you are looking for someone to takeover your place."
                  />
                </div>
              </div>
            </div>
            {friendly &&
              <div className="filter-form__section filter-form__section--checkdox-tags">
                <div className="filter-form__label filter-form__label--label-checkbox-tags">Friendly</div>
                <div className="filter-form__container">
                  <ul className="list-unstyled filter-form__checkbox-lists">
                    {friendly.map((c, i) =>
                      <li key={i}>
                        <Field
                          classNameLabel="form-checkbox__label form-checkbox__label--tag"
                          disabled={submitting}
                          name={`${c.name}`}
                          type="checkbox"
                          component={renderCheckbox}
                          label={`${c.name}`}
                        />
                      </li>
                    )}
                    {/*<li>
                      <div className="filter-form__select-item select-custom select-custom__multi">
                        <Field
                          disabled={submitting}
                          classNameInput="form-control input input--address"
                          name="tag_type_additional"
                          list={[{ value: 'sass', label: 'Sass' }, { value: 'js', label: 'JS' }, { value: 'php', label: 'PHP' }, { value: 'coffeeScript', label: 'CoffeeScript' }]}
                          type="select"
                          placeholder="Add additional tags..."
                          component={renderSelectbox}
                          multiple
                          searchable
                        />
                      </div>
                    </li>*/}
                  </ul>
                </div>
              </div>
            }
            {included &&
              <div className="filter-form__section filter-form__section--checkdox-tags">
                <div className="filter-form__label filter-form__label--label-checkbox-tags">Included in the rent</div>
                <div className="filter-form__container">
                  <ul className="list-unstyled filter-form__checkbox-lists">
                    {included.map((c, i) =>
                      <li key={i}>
                        <Field
                          classNameLabel="form-checkbox__label form-checkbox__label--tag"
                          disabled={submitting}
                          name={`${c.name}`}
                          type="checkbox"
                          component={renderCheckbox}
                          label={`${c.name}`}
                        />
                      </li>
                    )}
                    {/*<li>
                      <div className="filter-form__select-item select-custom select-custom__multi">
                        <Field
                          disabled={submitting}
                          name="tag_included_additional"
                          list={[{ value: 'java', label: 'Java' }, { value: 'javaScript', label: 'JavaScript' }, { value: 'ruby', label: 'Ruby' }, { value: 'python', label: 'Python' }]}
                          type="checkbox"
                          placeholder="Add additional tags..."
                          component={renderSelectbox}
                          multiple
                          searchable
                        />
                      </div>
                    </li>*/}
                  </ul>
                </div>
              </div>
            }
            {nearby &&
              <div className="filter-form__section filter-form__section--checkdox-tags">
                <div className="filter-form__label filter-form__label--label-checkbox-tags">Nearby tags</div>
                <div className="filter-form__container">
                  <ul className="list-unstyled filter-form__checkbox-lists">
                    {nearby.map((c, i) =>
                      <li key={i}>
                        <Field
                          classNameLabel="form-checkbox__label form-checkbox__label--tag"
                          disabled={submitting}
                          name={`${c.name}`}
                          type="checkbox"
                          component={renderCheckbox}
                          label={`${c.name}`}
                        />
                      </li>
                    )}
                    {/*<li>
                      <div className="filter-form__select-item select-custom select-custom__multi">
                        <Field
                          disabled={submitting}
                          name="tag_included_additional"
                          list={[{ value: 'java', label: 'Java' }, { value: 'javaScript', label: 'JavaScript' }, { value: 'ruby', label: 'Ruby' }, { value: 'python', label: 'Python' }]}
                          type="checkbox"
                          placeholder="Add additional tags..."
                          component={renderSelectbox}
                          multiple
                          searchable
                        />
                      </div>
                    </li>*/}
                  </ul>
                </div>
              </div>
            }
            </div>
        </div>

        <div className="filter-form__section filter-form__section--form-nav filter-form__nav">
          <Form.Button
            className="form-button--default-dark"
            disabled={submitting}
            type="button"
            onClick={this.handleCancel}
          >
            <span>Cancel</span>
          </Form.Button>
          <Form.Button
            className="form-button--user-action form-button--circle form-button--pink"
            disabled={submitting || pristine}
            type="submit"
          >
            <span>Apply</span>
          </Form.Button>
          {error ? <Form.Alert title={error || ''} className="alert-danger" /> : null}
        </div>
      </form>
    );
  }
}
