/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '315px',
  height: '315px',
};

class MapWrapper extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{ lat: -34.61, lng: -58.36 }}
      >
        <Marker
          onClick={this.onMarkerClick}
          name="Kenyatta International Convention Centre"
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
