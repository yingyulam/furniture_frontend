import React from "react";
import CardList from "./CardList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "./MyAccount.css";
import FavoritesDataService from "../services/favorites.js";
import FurnitureDataService from "../services/furniture.js";
import Axios from "axios";
import MyListings from "./MyListings";
import Table from 'react-bootstrap/Table';

const MyAccount = ({ user }) => {
	const [favorites, setFavorites] = useState([]);
	//const [history, setHistory] = useState([]);
	const [nicknameToDisplay, setNicknameToDisplay] = useState("");
	const [contactToDisplay, setContactToDisplay] = useState("");
	const [imageUrlToDisplay, setImageUrlToDisplay] = useState("");
	const [nickname, setNickname] = useState("");
	const [contact, setContact] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [imageLoading, setImageLoading] = useState(false);
	const [imageSelected, setImageSelected] = useState("");
	const [editProfile, setEditProfile] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadError, setUploadError] = useState("");
	const [uploadSuccess, setUploadSuccess] = useState(false);

	useEffect(() => {
		FavoritesDataService.getFavorites(user.googleId)
			.then((response) => {
				setFavorites(response.data.favorites);
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	const uploadProfilePicture = () => {
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

	const updateDetail = () => {
		const uploadImageUrl =
			imageUrl.trim() === "" ? imageUrlToDisplay : imageUrl.trim();
		const uploadNickname =
			nickname.trim() === "" ? nicknameToDisplay : nickname.trim();
		const uploadContact =
			contact.trim() === "" ? contactToDisplay : contact.trim();
		let data = {
			_id: user.googleId,
			imageUrl: uploadImageUrl,
			nickname: uploadNickname,
			contact: uploadContact,
		};
		FavoritesDataService.updateUserProfile(data).then((res) => {
			setImageUrlToDisplay(uploadImageUrl);
			setNicknameToDisplay(uploadNickname);
			setContactToDisplay(uploadContact);
		});
		setImageUrl("");
		setNickname("");
		setContact("");
		setUploadError("");
		setUploadSuccess(false);
		setUploadProgress(0);
		setEditProfile(false);
	};

	const closeEditPage = () => {
		setUploadError("");
		setUploadSuccess(false);
		setUploadProgress(0);
		setEditProfile(false);
	};

	useEffect(() => {
		FavoritesDataService.getFavorites(user.googleId).then((res) => {
			const response = res.data;
			setImageUrlToDisplay(
				"imageUrl" in response ? response.imageUrl : imageUrl
			);
			setNicknameToDisplay(
				"nickname" in response && response.nickname.trim() !== ""
					? response.nickname
					: user.name
			);
			setContactToDisplay(
				"contact" in response && response.contact.trim() !== ""
					? response.contact
					: user.email
			);
		});
	}, []);

	console.log(user);

	return (
		<div>
			<Container className="favoritesContainer">
				<Row>
					<Col>
						<Card>
							<Card.Header as="h5">My Account</Card.Header>
							<Card.Body>
								<div className="profile">
									<Image
										className="favoritesPoster mb-3"
										src={imageUrlToDisplay}
										onError={({ currentTarget }) => {
											currentTarget.onerror = null;
											currentTarget.src = "/images/NoProfilePicture.png";
										}}
									/>
								</div>
                <Table>
                  <tbody>
                    <tr>
                      <td></td><td></td>
                    </tr>
                    <tr>
                      <td>Account name</td>
                      <td>{user.name}</td>
                    </tr>
                    <tr>
                      <td>Account email</td>
                      <td>{user.email}</td>
                    </tr>
                    <tr>
                      <td>Nickname (display to public)</td>
                      <td>{nicknameToDisplay}</td>
                    </tr>
                    <tr>
                      <td>Perferred contact (display to public)</td>
                      <td>{contactToDisplay}</td>
                    </tr>

                  </tbody>
                </Table>
								{/* <Card.Text><b>Account name: </b>{user.name}</Card.Text>
								<Card.Text><b>Account email: </b>{user.email}</Card.Text>
								<Card.Text>
									<b>Nickname (display to public): </b>{nicknameToDisplay}
								</Card.Text>
								<Card.Text>
									<b>Perferred contact (display to public): </b>{contactToDisplay}
								</Card.Text> */}
								<Button
									variant="secondary"
									onClick={() => {
										setEditProfile(true);
									}}
								>
									Edit profile
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						{editProfile && (
							<Card>
								<Card.Header as="h5">Changing Account Profile</Card.Header>
								<Card.Body>
									<Form>
										<Form.Group>
											<div className="mb-3 mt-3">
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
													onClick={uploadProfilePicture}
													variant="outline-secondary"
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
														<div>✓ Photo uploaded! Click Submit to save.</div>
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
												value={nickname}
												onChange={(e) => {
													setNickname(e.target.value);
												}}
												placeholder={"Nickname"}
												className="mb-3"
											/>
											<Form.Control
												type="text"
												value={contact}
												required
												onChange={(e) => {
													setContact(e.target.value);
												}}
												placeholder={"Perferred contact"}
												className="mb-3"
											/>
										</Form.Group>
										<Button
											variant="outline-secondary"
											onClick={updateDetail}
											className="me-3"
											disabled={imageLoading}
										>
											Submit
										</Button>
										<Button
											variant="outline-secondary"
											onClick={closeEditPage}
											className="ms-3"
										>
											Close
										</Button>
									</Form>
								</Card.Body>
							</Card>
						)}
					</Col>
				</Row>

				<MyListings user={user} />

				<Row>
					<Col>
						<div /*className="favoritesList"*/>
							<Card>
								<Card.Header as="h5">My Wishlist</Card.Header>

								<DndProvider backend={HTML5Backend}>
									{favorites.length === 0 && <h5>No item in wishlist.</h5>}
									<CardList user={user} list={favorites} isFavorite={true} />
								</DndProvider>
							</Card>
						</div>
					</Col>
				</Row>
				{/* <Row>
					<Col>
						<div className="favoritesList">
              <Card>
							<Card.Header as="h4">My Listings</Card.Header>
							<DndProvider backend={HTML5Backend}>
								{history.length === 0 && (
									<h4>Please make a posting to browse listing history.</h4>
								)}
								<CardList user={user} list={history} isFavorite={false} />
							</DndProvider>
              </Card>
						</div>
					</Col>
				</Row> */}
			</Container>
		</div>
	);
};

export default MyAccount;
