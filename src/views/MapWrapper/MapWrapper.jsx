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

  onMarkerClick = (props, marker, e) =>
    console.log(`${this.props.lat}, ${this.props.lon}`);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

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
        initialCenter={{ lat: this.props.lat, lng: this.props.lon }}
      >
        <Marker
          // onClick={this.onMarkerClick}
          // name={this.props.markerText}
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
