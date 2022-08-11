import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import Map from './Map'

const Location = ({ user }) => {

  // const [location, setLocation] = useState(null);

  // const onChangeLocation = (e) => {
	// 	const location = e.target.value;
	// 	setLocation(location);
	// };

  return (
    <Autocomplete
      apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
      onPlaceSelected={(place) => {
        const location = {
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        console.log(location);
        // value={location}
				// onChange={onChangeLocation}

      }}
    />
  )

}

export default Location;