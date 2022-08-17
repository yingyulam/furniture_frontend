/*source: https://blog.logrocket.com/integrating-google-maps-react/*/

import React from "react";
import GoogleMapReact from "google-map-react";
import "./Map.css";

// const LocationPin = ({ text }) => (
//   <div className="pin">
//     <Icon icon={locationIcon} className="pin-icon"
//     />
//     <p className="pin-text">{text}</p>
//   </div>
// )

// const LocationPin = ({ text }) => (
//     <div style={{
//       color: 'black',
//       padding: '15px 15px',
//       display: 'inline-flex',
//       textAlign: 'center',
//       alignItems: 'center',
//       justifyContent: 'center',
//       borderRadius: '100%',
//       transform: 'translate(-50%, -50%)'
//     }} className="circle">
//     {text}
//   </div>
// );

const Map = ({ location, zoomLevel }) => {
	const mapKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

	return (
		<div className="map">
			<div style={{ height: "400px", width: "100%" }}>
				<GoogleMapReact
					bootstrapURLKeys={{ key: mapKey }}
					defaultCenter={location}
					defaultZoom={zoomLevel}
				>
					{/* <LocationPin 
          lat={location.lat}
          lng={location.lng}
          text={location.address.split(",")[0]}
        /> */}
				</GoogleMapReact>
			</div>
		</div>
	);
};

export default Map;
