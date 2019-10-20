/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '315px',
  height: '315px',
};

class MapWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false, // Hides or the shows the infoWindow
      activeMarker: {}, // Shows the active marker upon click
      selectedPlace: {}, // Shows the infoWindow to the selected place upon a marker
    };
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={ { lat: -34.6175, lng: -58.3683 } }
        center={ { lat: this.props.lat, lng: this.props.lon } }
      >
        <Marker
          position={ { lat: this.props.lat, lng: this.props.lon } }
          // onClick={this.onMarkerClick}
          // name="Direccion prestador"
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: props.APIKey,
  }
  ),
)(MapWrapper);
