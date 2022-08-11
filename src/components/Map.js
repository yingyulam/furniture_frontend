import React from 'react'
import GoogleMapReact from 'google-map-react'
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={locationIcon} className="pin-icon" 
    />
    <p className="pin-text">{text}</p>
  </div>
)

const Map = ({ location, zoomLevel }) => {

  const mapKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY
  
  return (
  <div className="map">
    <h2 className="map-h2">Location for This Listing</h2>

    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: mapKey }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
        <LocationPin 
          lat={location.lat}
          lng={location.lng}
          text={location.address}
        />

      </GoogleMapReact>
    </div>
  </div>
  )
}



export default Map