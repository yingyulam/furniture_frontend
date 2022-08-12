import { Wrapper, Status } from "@googlemaps/react-wrapper";
import React from 'react';
import GoogleMapReact from 'google-map-react';

const GoogleMap = ({ location, zoomLevel }) => {

  const mapKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY

  const marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
});

  return (
  <div className="map">
    <h2 className="map-h2">Location for This Listing</h2>

    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: mapKey }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >

      </GoogleMapReact>
    </div>
  </div>
  )
}

export default GoogleMap
