import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
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
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadError, setUploadError] = useState("");
	const [uploadSuccess, setUploadSuccess] = useState(false);

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
		if (!imageSelected) {
			setUploadError("Please choose an image file first.");
			return;
		}
		const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
		const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
		const formData = new FormData();
		formData.append("file", imageSelected);
		formData.append("upload_preset", uploadPreset);
		setUploadError("");
		setUploadSuccess(false);
		setUploadProgress(0);
		setImageLoading(true);
		Axios.post(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			formData,
			{
				onUploadProgress: (progressEvent) => {
					const total = progressEvent.total || progressEvent.loaded;
					const percent = Math.round((progressEvent.loaded * 100) / total);
					setUploadProgress(percent);
				},
			}
		)
			.then((res) => {
				setImageUrl(res.data.secure_url);
				setUploadProgress(100);
				setUploadSuccess(true);
				setImageLoading(false);
			})
			.catch((e) => {
				console.log(e);
				setUploadError(
					"Upload failed. Please check your connection and try again."
				);
				setUploadProgress(0);
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
										accept="image/*"
										onChange={(e) => {
											setImageSelected(e.target.files[0]);
											setUploadError("");
											setUploadSuccess(false);
											setUploadProgress(0);
										}}
									/>
									<Button
										onClick={uploadImage}
										variant="secondary"
										disabled={imageLoading || !imageSelected}
									>
										{imageLoading ? (
											<>
												<Spinner
													as="span"
													animation="border"
													size="sm"
													role="status"
													aria-hidden="true"
												/>{" "}
												Uploading...
											</>
										) : (
											"Upload"
										)}
									</Button>

									{imageLoading && (
										<ProgressBar
											className="mt-2"
											now={uploadProgress}
											label={`${uploadProgress}%`}
											animated
										/>
									)}

									{uploadError && (
										<Alert variant="danger" className="mt-2 mb-0 py-2">
											{uploadError}
										</Alert>
									)}

									{!imageLoading && uploadSuccess && imageUrl !== "" && (
										<Alert variant="success" className="mt-2 mb-0 py-2">
											<div>✓ Image uploaded successfully!</div>
											<Image
												src={imageUrl}
												thumbnail
												style={{ maxHeight: "120px", marginTop: "8px" }}
												alt="uploaded preview"
											/>
										</Alert>
									)}
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
								variant="secondary"
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
