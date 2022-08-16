import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FurnitureDataService from "../services/furniture";
import Axios from "axios";

import "./UploadItem.css";
import GooglePlacesAutocomplete from "react-google-autocomplete";

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

	let loc = useLocation();
	let editing = loc.state !== null;
	const backLink = editing ? loc.state.to : "all_products";
	const _id = editing ? loc.state._id : "";

	const [name, setName] = useState(editing ? loc.state.name : "");
	const [price, setPrice] = useState(editing ? loc.state.price : 0);
	const [description, setDescription] = useState(
		editing ? loc.state.description : ""
	);
	const [category, setCategory] = useState(
		editing ? loc.state.category : "Others"
	);
	const [imageUrl, setImageUrl] = useState(editing ? loc.state.imageUrl : "");
	const [condition, setCondition] = useState(
		editing && loc.state.condition ? loc.state.condition : conditions[0]
	);
	const [location, setLocation] = useState(editing ? loc.state.location : null);
	const [imageLoading, setImageLoading] = useState(false);
	const [imageSelected, setImageSelected] = useState("");

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

		if (!editing) {
			FurnitureDataService.uploadItem(data)
				.then((res) => {
					navigate("/all_products/?alert=created");
					window.location.reload();
				})
				.catch((e) => console.log(e));
		} else {
			FurnitureDataService.updateItem({ ...data, _id: _id }).then((res) => {
				if (backLink === "detailed_page") {
					navigate(`/furniture/${_id}/?alert=modified`);
				} else {
					navigate("/all_products/?alert=modified");
					window.location.reload();
				}
			});
		}
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
					Please sign in to to sell!
				</h2>
			)}
			{user && (
				<div>
					<h2 style={{ textAlign: "center", marginTop: "10px" }}>
						{`${editing ? "Edit" : "Create"} item for sell on this website!`}
					</h2>
					<Container className="main-container">
						<Form>
							<Form.Group>
								{editing &&
									(imageUrl === "" ? (
										<div>No image uploaded</div>
									) : (
										<div>
											{`Image uploaded with url ${imageUrl}, upload again to replace`}
										</div>
									))}
								<div className="mb-3">
									<input
										type="file"
										onChange={(e) => {
											setImageSelected(e.target.files[0]);
										}}
									/>
									<Button onClick={uploadImage} variant="warning">
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
											value={cat}
											active={cat === category}
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
							{location && (
								<div>
									Current location chosen: {location.address} Upload location
									again to replace
								</div>
							)}

							<GooglePlacesAutocomplete
								apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
								onPlaceSelected={(place) => {
									const location = {
										address: place.formatted_address,
										lat: place.geometry.location.lat(),
										lng: place.geometry.location.lng(),
									};
									setLocation(location);
								}}
							/>
							<br />
							{/* <Map location={location} zoomLevel={17} /> */}
							<Button
								variant="warning"
								onClick={saveItem}
								className="mt-3"
								disabled={imageLoading || name === ""}
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
