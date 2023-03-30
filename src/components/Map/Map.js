import React, { Component, PropTypes } from 'react';
import { withGoogleMap, GoogleMap, Marker, Circle, DirectionsRenderer } from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/addons/InfoBox';
import {} from './Map.scss';
import { parseAddressComponents } from 'utils/helpers';
import { ProductCard } from 'components';
import mapStyles from './mapStyles.json';
import closeIcon from '../../../icons/svg/icon-close-popup.svg';
import markerIcon from '../../../icons/svg/icon-marker.svg';
import markerIconCircle from '../../../icons/svg/icon-marker-circle.svg';

const lineSymbol = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 1,
  strokeColor: '#ff3366',
  strokeWeight: 3,
  scale: 3
};

const polylineOptions = {
  icons: [{
    icon: lineSymbol,
    offset: '0',
    repeat: '14px'
  }],
  strokeOpacity: 0
};

const directionsRendererOptions = {
  polylineOptions,
  suppressMarkers: true,
  suppressBicyclingLayer: true
};

const RenderMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    onIdle={props.handleMapIdle}
    defaultZoom={props.defaultZoom}
    defaultCenter={props.defaultCenter}
    onZoomChanged={props.handleMapZoomChanged}
    options={{
      ...props.mapOptions,
      ...{
        styles: mapStyles,
        scrollwheel: props.scrollwheel,
        zoomControl: props.zoomControl,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        clickableIcons: props.clickableIcons,
        fullscreenControl: false
      },
      ...(props.zoom ? {zoom: props.zoom} : {})
    }}
    {...(props.center ? {center: props.center} : {})}
    {...(props.updateBounds ? {onBoundsChanged: props.handleMapBounds} : {})}
    {...(props.markers_labels ? {onDragEnd: props.handleMapDragEnd} : {})}
  >
    {props.markers && !props.hide_init_markers && props.markers.map((c, i) =>
      <Marker
        key={i}
        position={{ lat: c.lat, lng: c.lng }}
        draggable={props.draggableMarker}
        options={{
          icon: markerIcon,
          size: new google.maps.Size(26, 34), // eslint-disable-line
          zIndex: 1000
        }}
        {...(props.draggableMarker ? {onDragEnd: e => props.handleMarkerDragEnd(e)} : {})}
      />
    )}
    {props.directions_markers && props.directions_markers.map((c, i) =>
      i === 0 ?
        (!props.replaceCircleWithMarker && props.circles) ?
          /* circle will increase/decrease size depending of the map zoom */
          <Circle
            key={i}
            center={{ lat: c.lat, lng: c.lng }}
            radius={220}
            options={{
              fillColor: '#ff3366',
              fillOpacity: 1,
              strokeWeight: 0,
              clickable: false
            }}
          /> :
          /* marker will always be the same size */
          <Marker
            key={i}
            position={{ lat: c.lat, lng: c.lng }}
            clickable={false}
            options={{
              icon: c.icon,
              size: c.icon.size || c.size
            }}
          /> :
        <Marker
          key={i}
          position={{ lat: c.lat, lng: c.lng }}
          clickable={false}
          options={{
            icon: c.icon,
            size: c.icon.size || c.size
          }}
        />
    )}
    {/* http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/infobox/docs/reference.html */}
    {props.markers_labels && props.markers_labels.map((c, i) =>
      <InfoBox
        key={c.id}
        position={new google.maps.LatLng(c.lat, c.lng)} //eslint-disable-line
        options={{
          boxStyle: {
            minWidth: '54px',
            maxWidth: '110px',
            marginLeft: '-45px'
          },
          boxClass: 'infoBox infoBox--label',
          disableAutoPan: true,
          enableEventPropagation: true,
          closeBoxURL: ''
        }}
      >
        <div
          className={'map-marker' + (c.id ? ` map-marker-${c.id}` : '') + (c.viewed ? ' map-marker--viewed' : '')}
          onClick={e => props.handleBoxClick(e, i, c.id)}
        >
          <div className="map-marker__label">
            {`$${c.content}`}
          </div>
        </div>
      </InfoBox>
    )}
    {props.markers_labels && props.boxContent &&
      <InfoBox
        position={new google.maps.LatLng(props.boxContent.lat, props.boxContent.lng)} //eslint-disable-line
        onCloseClick={props.handleBoxClose}
        options={{
          boxStyle: {
            minWidth: '260px',
            zIndex: 1
          },
          boxClass: 'infoBox infoBox--popup',
          closeBoxMargin: 0,
          closeBoxURL: closeIcon,
          enableEventPropagation: true,
          pixelOffset: new google.maps.Size(-130, -30), // eslint-disable-line
          infoBoxClearance: new google.maps.Size(10, 10) // eslint-disable-line
        }}
      >
        <div className="map-infobox" id="map-infobox" ref={props.handleInfoBoxLoad}>
          <ProductCard
            info={props.boxContent.cardInfo}
            onClick={props.toggleProductModal}
            toggleUserModal={props.toggleUserModal}
          />
        </div>
      </InfoBox>}
    {props.circles && !props.hide_init_markers && props.circles.map((c, i) =>
      !props.replaceCircleWithMarker ?
        /* circle will increase/decrease size depending of the map zoom */
        <Circle
          key={i}
          center={{ lat: c.lat, lng: c.lng }}
          radius={220}
          options={{
            fillColor: '#ff3366',
            fillOpacity: 0.5,
            strokeWeight: 0,
            clickable: false
          }}
        /> :
        /* marker will always be the same size */
        <Marker
          key={i}
          position={{ lat: c.lat, lng: c.lng }}
          clickable={false}
          options={{
            icon: {
              path: google.maps.SymbolPath.CIRCLE, // eslint-disable-line
              fillColor: '#ff3366',
              fillOpacity: 0.5,
              strokeWeight: 0,
              scale: 40 //pixels
            }
          }}
        />
    )}
    {props.directions && <DirectionsRenderer directions={props.directions} options={props.directionsOptions} />}
  </GoogleMap>
));

export default class Map extends Component {
  static propTypes = {
    className: PropTypes.string,
    autocompleteName: PropTypes.string,
    coordinatesName: PropTypes.string,
    postalCodeName: PropTypes.string,
    neighborhoodName: PropTypes.string,
    stateName: PropTypes.string,
    height: PropTypes.string,
    travel_mode: PropTypes.string,
    autocompleteId: PropTypes.string,
    changeForm: PropTypes.func,
    setFilters: PropTypes.func,
    setParams: PropTypes.func,
    addViewedPost: PropTypes.func,
    children: PropTypes.node,
    pointB: PropTypes.object,
    directions: PropTypes.object,
    markers_labels: PropTypes.any,
    circles: PropTypes.any,
    preventUpdate: PropTypes.bool,
    // closeOnZoom: PropTypes.bool
  };

  static defaultProps = {
    addViewedPost: () => {},
    className: '',
    height: '503px',
    defaultZoom: 12,
    minZoom: 4,
    maxZoom: 17,
    defaultCenter: { lat: 42.3600825, lng: -71.0588801 },
    scrollwheel: true,
    zoomControl: false,
    clickableIcons: false
  };

  constructor() {
    super();
    this.state = {
      boxId: null,
      replaceCircleWithMarker: false
    };
    this._timer = null;
    this._map = null;
    this.mapLoaded = false;
    this.mapBounds = null;
    this.bounded = false;
    this._infoBox = null;
    this._autocompleteInput = null;
    this._clickedBox = null;

    this.handleMapLoad = ::this.handleMapLoad;
    this.handleMapIdle = ::this.handleMapIdle;
    this.handleMapBounds = ::this.handleMapBounds;
    // this.handleMapWrapClick = ::this.handleMapWrapClick;
    // this.handleMapClick = ::this.handleMapClick;
    this.handleMapDragEnd = ::this.handleMapDragEnd;
    this.handleMapZoomChanged = ::this.handleMapZoomChanged;
    this.handleMarkerDragEnd = ::this.handleMarkerDragEnd;
    this.handleBoxClick = ::this.handleBoxClick;
    this.handleBoxClose = ::this.handleBoxClose;
    this.handleClick = ::this.handleClick;
    this.handleInfoBoxLoad = ::this.handleInfoBoxLoad;
    this.setMapParams = ::this.setMapParams;
    // this.checkInfoProduct = ::this.checkInfoProduct;
  }

  componentDidMount() {
    /* eslint-disable */
    if (google) {
      this._geocoder = new google.maps.Geocoder;
      this._directionsService = new google.maps.DirectionsService();

      if (this.props.autocompleteId) this._autocompleteInput = document.getElementById(this.props.autocompleteId);
      if (this.props.markers_labels) document.addEventListener('click', this.handleClick);
    }
    /* eslint-enable */
    // window.addEventListener('touchstart', this.checkInfoProduct);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pointB && (nextProps.travel_mode !== this.props.travel_mode || JSON.stringify(nextProps.pointB) !== JSON.stringify(this.props.pointB))) {
      this.calcRoute({
        defCenter: nextProps.defaultCenter,
        pointB: nextProps.pointB,
        mode: nextProps.travel_mode
      });
    }
    if (this.props.directions && !nextProps.directions && this.mapBounds) {
      this._map.fitBounds(this.mapBounds);
      this._map.panToBounds(this.mapBounds);
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
    if (this.props.markers_labels) document.removeEventListener('click', this.handleClick);
    // window.removeEventListener('touchstart', this.checkInfoProduct);
  }

  getComponents(coordinates) {
    /* eslint-disable */
    return new Promise((resolve, reject) => {
      this._geocoder.geocode({'location': coordinates}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            resolve(results[0].address_components);
          }
        } else {
          reject('No results found')
        }
      });
    });
    /* eslint-enable */
  }

  getMapBounds(mapBounds) {
    if (!this._map) return;
    const bounds = this._map.getBounds();

    if (mapBounds) return bounds; // eslint-disable-line
    return { // eslint-disable-line
      ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getSouthWest().lng() },
      sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getNorthEast().lng() }
    };
  }

  getDirectionsMarkers(legs) {
    /* eslint-disable */
    const start = {
      lat: legs.start_location.lat(),
      lng: legs.start_location.lng(),
      icon: this.props.markers ? markerIcon : {
        url: markerIconCircle,
        size: new google.maps.Size(80, 80),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(40, 40)
      }
    };
    const end = {
      lat: legs.end_location.lat(),
      lng: legs.end_location.lng(),
      icon: markerIcon,
      size: new google.maps.Size(26, 34)
    };

    return [start, end];
    /* eslint-enable */
  }

  // bug on ios: https://trello.com/c/hsaJF7Pq/593-map-bug-on-phone-after-i-close-listing-card-i-am-not-able-to-navigate-through-the-map-it-keeps-zooming-in-and-out
  // checkInfoProduct(e) {
  //   const infobox = document.getElementById('map-infobox');
  //   if (infobox && !infobox.contains(e.target)) {
  //     this.handleBoxClose();
  //   }
  // }

  setMapParams(cb) {
    cb(this);
  }

  handleMapLoad(map) {
    this._map = map;
    this.handleMapZoomChanged();
    // okay( i won't use :disappointed:
    // google.maps.event.addListenerOnce(this._map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, 'idle', () => { // eslint-disable-line
    //   this.mapBounds = this.getMapBounds(true);
    // });
  }

  handleInfoBoxLoad(infoBox) {
    this._infoBox = infoBox;
  }

  handleMapIdle() {
    if (!this.mapLoaded) {
      // when handleMapLoad invoked getBounds in this.getMapBounds returns undefined
      this.mapBounds = this.getMapBounds(true);
      this.mapLoaded = true;
    }
  }

  handleMapBounds() {
    clearTimeout(this._timer);
    if (this.state.boxId) return;

    this._timer = setTimeout(() => {
      if (this.bounded && !this.props.preventUpdate) {
        // console.log('MAP_BOUNDS', this.getMapBounds());
        this.props.setFilters({location: this.getMapBounds()});
        // this.boxIndexUpdated = false;
      } else {
        this.bounded = true;
      }
    }, 300);
  }

  handleMarkerDragEnd(e) {
    /* eslint-disable */
    const coordinates = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    // console.log('COORDINATES', coordinates);

    this.getComponents(coordinates)
      .then(result => {
        const address = parseAddressComponents(result);
        this.fillForm(address, coordinates);
      })
      .catch(error => console.log(error));
    /* eslint-enable */
  }

  handleBoxClick(e, i, id) {
    let target = e.target;

    while (target && !target.classList.contains('map-marker')) {
      target = target.parentElement;
    }
    if (target) {
      // target.classList.add('map-marker--viewed');
      this.props.addViewedPost(id);
      this.handleBoxClose() // needed for correct positioning of the second popup if the first one is opened
        .then(() => {
          this.setState({boxId: id});
          this._clickedBox = target;
          clearTimeout(this._timer);
        });
    }
  }

  handleBoxClose() {
    this.setState({
      boxId: null
    });
    this._infoBox = null;
    this._clickedBox = null;
    return Promise.resolve();
  }

  handleClick(e) {
    // close infoBox
    if (this.state.boxId && !this._infoBox.contains(e.target) && !this._clickedBox.contains(e.target)) {
      this.handleBoxClose();
    }
    // remove autocomplete focus
    if (this._autocompleteInput && !this._autocompleteInput.contains(e.target)) this.removeAutocompleteFocus();
  }

  // handleMapWrapClick(e) {
  //   let target = e.target;
  //   let found = false;

  //   while (target && !target.classList.contains('map')) {
  //     // console.log(target);
  //     if (target.classList.contains('infoBox')) {
  //       found = true;
  //       break;
  //     }
  //     target = target.parentElement;
  //   }
  //   if (!found && this.state.boxId) this.handleBoxClose();
  // }

  // handleMapClick() {
  //   this.removeAutocompleteFocus();
  // }

  handleMapDragEnd() {
    if (this.state.boxId) this.handleBoxClose();
    this.removeAutocompleteFocus();
  }

  handleMapZoomChanged() {
    if (!this._map) return;

    if (this.props.circles) {
      const zoom = this._map.getZoom(); // eslint-disable-line

      if (zoom <= 14 && !this.state.replaceCircleWithMarker) this.setState({replaceCircleWithMarker: true});
        else if (zoom > 14 && this.state.replaceCircleWithMarker) this.setState({replaceCircleWithMarker: false}); // eslint-disable-line
    }
  }

  fillForm(address, coordinates) {
    const { changeForm, autocompleteName, postalCodeName, neighborhoodName, coordinatesName, stateName } = this.props;

    changeForm(coordinatesName, coordinates);
    !!autocompleteName && changeForm(autocompleteName, address.street);
    !!postalCodeName && changeForm(postalCodeName, address.postalCode || '');
    !!neighborhoodName && changeForm(neighborhoodName, address.neighborhood || '');
    !!stateName && changeForm(stateName, address.state || '');
  }

  calcRoute({ defCenter, pointB, mode }) {
    /* eslint-disable */
    const { setParams } = this.props;
    const req = {
      origin: new google.maps.LatLng(defCenter.lat, defCenter.lng),
      destination: new google.maps.LatLng(pointB.lat, pointB.lng),
      travelMode: google.maps.TravelMode[mode]
    };
    setParams({
      directions_loading: true
    });

    this._directionsService.route(req, (result, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        const legs = result.routes[0].legs[0];
        const duration = legs.duration.text;

        setParams({
          directions_loading: false,
          directions: result,
          hide_init_markers: true,
          directions_markers: this.getDirectionsMarkers(legs),
          travel_time: duration
        });
      } else {
        setParams({
          directions_loading: false,
          travel_time: null
        });
        // console.log(`Directions request failed due to ${status}`);
      }
    });
    // console.log('CENTER', defaultCenter);
    // console.log('POINTB', pointB);
    /* eslint-enable */
  }

  removeAutocompleteFocus() {
    if (this._autocompleteInput) this._autocompleteInput.blur();
  }

  render() {
    const { className, height } = this.props;

    return (
      <div className={`map ${className}`}/* {...(this.props.markers_labels ? {onClick: this.handleMapWrapClick} : {})}*/>
        <RenderMap
          containerElement={
            <div style={{ height }} />
          }
          mapElement={
            <div className="map__inner" style={{ height }} /*{...(this.props.autocompleteId ? {onClick: this.handleMapClick} : {})}*/ />
          }
          {...this.props}
          onMapLoad={this.handleMapLoad}
          handleMapBounds={this.handleMapBounds}
          handleMapDragEnd={this.handleMapDragEnd}
          handleMapZoomChanged={this.handleMapZoomChanged}
          handleMarkerDragEnd={this.handleMarkerDragEnd}
          handleMapIdle={this.handleMapIdle}
          boxContent={(this.props.markers_labels && this.state.boxId && this.props.markers_labels.find(c => c.id === this.state.boxId)) || null}
          replaceCircleWithMarker={this.state.replaceCircleWithMarker}
          handleBoxClick={this.handleBoxClick}
          handleBoxClose={this.handleBoxClose}
          directionsOptions={directionsRendererOptions}
          handleInfoBoxLoad={this.handleInfoBoxLoad}
        />

        {this.props.children}
      </div>
    );
  }
}
