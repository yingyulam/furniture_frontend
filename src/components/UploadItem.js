import { useState } from "react";
import { useNavigate } from "react-router";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FurnitureDataService from "../services/furniture";
import Axios from "axios";
// import Location from "./Location"
import GooglePlacesAutocomplete from "react-google-autocomplete";
import Map from "./Map"

const UploadItem = ({ user }) => {
	const conditions = ["Brand New", "Like New", "Good", "Fair"];
	const categories = [
		"Living Room",
		"Dinning Room",
		"Bedroom",
		"Bathroom",
		"Garden",
		"Others",
	];

  // const defaultLocation = {
  //   address: 'Vancouver',
  //   lat: 49.2827,
  //   lng: -123.1207,
  // }

	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("None");
	const [imageUrl, setImageUrl] = useState("");
	const [imageSelected, setImageSelected] = useState("");
	const [imageLoading, setImageLoading] = useState(false);
	const [condition, setCondition] = useState(conditions[0]);
  const [location, setLocation] = useState(null);

	const saveItem = () => {
		let data = {
			user: user,
			name: name,
			price: price,
			description: description,
			category: category,
			imageUrl: imageUrl,
			condition: condition,
      location: location,
		};

		FurnitureDataService.uploadItem(data)
			.then((res) => {
				navigate("/all_products");
			})
			.catch((e) => console.log(e));
	};

	const onChangeName = (e) => {
		setName(e.target.value);
	};

	const onChangePrice = (e) => {
		setPrice(e.target.value);
	};

	const onChangeDescription = (e) => {
		setDescription(e.target.value);
	};

	const onChangeCondition = (con) => {
		setCondition(con);
	};

  // const onChangeLocation = (e) => {
  //   setLocation(e.target.value);
  // }

	const uploadImage = () => {
		const formData = new FormData();
		formData.append("file", imageSelected);
		formData.append("upload_preset", "dsvru7rj");
		setImageLoading(true);
		Axios.post(
			"https://api.cloudinary.com/v1_1/ddprfjhmn/image/upload",
			formData
		).then((res) => {
			setImageUrl(res.data.secure_url);
			setImageLoading(false);
		});
	};

	return (
		<div>
			{!user && (
				<h2 style={{ textAlign: "center", marginTop: "10px" }}>
					Please log in to upload things to sell!
				</h2>
			)}
			{user && (
				<div>
					<h2 style={{ textAlign: "center", marginTop: "10px" }}>
						Create item for sell on this website!
					</h2>
					<Container className="main-container">
						<Form>
							<Form.Group>
								<div className="mb-3">
									<input
										type="file"
										onChange={(e) => {
											setImageSelected(e.target.files[0]);
										}}
									/>
									<Button onClick={uploadImage} variant="success">
										{" "}
										Upload
									</Button>
								</div>
								<Form.Control
									type="text"
									required
									value={name}
									onChange={onChangeName}
									placeholder={"Name of item selling"}
									className="mb-3"
								/>
								<Form.Control
									type="number"
									required
									value={price}
									onChange={onChangePrice}
									placeholder={"Price"}
									className="mb-3"
								/>
								<Form.Control
									as="textarea"
									type="text"
									required
									value={description}
									onChange={onChangeDescription}
									placeholder={"description"}
									className="mb-3"
								/>
							</Form.Group>
							<ButtonGroup className="mb-2">
								{categories.map((cat, i) => {
									return (
										<Button
											variant="light"
											key={i}
											onClick={() => {
												setCategory(cat);
											}}
										>
											{cat}
										</Button>
									);
								})}
							</ButtonGroup>
							<br />
							<br />
							<h5>Condition</h5>
							<DropdownButton title={condition} variant="light">
								{conditions.map((con, i) => {
									return (
										<Dropdown.Item
											key={i}
											onClick={() => {
												onChangeCondition(con);
											}}
										>
											{con}
										</Dropdown.Item>
									);
								})}
							</DropdownButton>
							<br />

              <h5>Location</h5>
              {/* <Location user={user} /> */}

              <GooglePlacesAutocomplete
                apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                onPlaceSelected={(place) => {
                  const location = {
                    address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  }
                  console.log(location)
                  setLocation(location);
                }}
              />
              <br />
              {/* <Map location={location} zoomLevel={17} /> */}
							<Button
								variant="primary"
								onClick={saveItem}
								className="mt-3"
								disabled={imageLoading}
							>
								Submit
							</Button>
              
						</Form>
					</Container>
				</div>
			)}
		</div>
	);
};

export default UploadItem;
