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
import "./MyAccount.css";
import FavoritesDataService from "../services/favorites.js";
import FurnitureDataService from "../services/furniture.js";
import Axios from "axios";
import MyListings from "./MyListings";

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

	const updateDetail = () => {
		let data = {
			_id: user.googleId,
			imageUrl: imageUrl,
			nickname: nickname,
			contact: contact,
		};
		FavoritesDataService.updateUserProfile(data).then((res) => {
			const response = res.data;
			debugger;
			setImageUrlToDisplay(
				"imageUrl" in response ? response.imageUrl : imageUrl
			);
			setNicknameToDisplay(nickname.trim() !== "" ? nickname : user.name);
			setContactToDisplay(contact.trim() !== "" ? contact : user.email);
		});
		setImageUrl("");
		setNickname("");
		setContact("");
		setEditProfile(false);
	};

	const closeEditPage = () => {
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

  console.log(user)

	return (
		<div>
			<Container className="favoritesContainer">
				<Row>
					<Col>
						<Card>
							<Card.Header as="h5">My Account</Card.Header>
							<Card.Body>
								<div>
									<Image
										className="favoritesPoster mb-3"
										src={imageUrlToDisplay}
										onError={({ currentTarget }) => {
											currentTarget.onerror = null;
											currentTarget.src = "/images/NoProfilePicture.png";
										}}
									/>
								</div>
								<Card.Text>Account name: {user.name}</Card.Text>
								<Card.Text>Account email: {user.email}</Card.Text>
								<Card.Text>
									Nickname (display to public): {nicknameToDisplay}
								</Card.Text>
								<Card.Text>
									Perferred contact (display to public): {contactToDisplay}
								</Card.Text>
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
													onChange={(e) => {
														setImageSelected(e.target.files[0]);
													}}
												/>
												<Button
													onClick={uploadProfilePicture}
													variant="outline-secondary"
												>
													Upload
												</Button>
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
