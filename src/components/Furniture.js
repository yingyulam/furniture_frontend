import React, { useState, useEffect } from "react";
import FurnitureDataService from "../services/furniture";
import FavoriteController from "../services/favorites";
import {
	useParams,
	Link,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import Map from "./Map";
import Moment from "react-moment";
import Alert from "react-bootstrap/Alert";
import "./Furniture.css";

const Furniture = ({ user, favorites, addFavorite, deleteFavorite }) => {
	let params = useParams();

	const navigate = useNavigate();
	const [furniture, setFurniture] = useState({
		id: null,
		name: "",
		category: "",
		price: "",
		user: {},
		location: null,
	});
	const [alertContent, setAlertContent] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();
	const [nickname, setNickname] = useState("");
	const [contact, setContact] = useState("");

	useEffect(() => {
		const getFurniture = (id) => {
			FurnitureDataService.getFurnitureById(id)
				.then((response) => {
					setFurniture(response.data);
				})
				.catch((e) => {
					console.log(e);
				});
		};

		getFurniture(params.id);
	}, [params.id]);

	useEffect(() => {
		if ("googleId" in furniture.user) {
			FavoriteController.getFavorites(furniture.user.googleId).then((res) => {
				const response = res.data;
				console.log(response);
				setNickname("nickname" in response ? response.nickname : nickname);
				setContact("contact" in response ? response.contact : contact);
			});
		}
	}, [furniture]);

	useEffect(() => {
		const content = searchParams.get("alert");
		if (content !== "") {
			setAlertContent(content);
			setTimeout(() => {
				setAlertContent("");
			}, 3000);
		}
	}, []);

	const deleteFurniture = (objectId, googleId) => {
		let data = {
			objectId: objectId,
			userId: googleId,
		};
		deleteFavorite(objectId);
		FurnitureDataService.deleteItem(data)
			.then((res) => {
				navigate("/all_products?alert=deleted");
			})
			.catch((e) => {
				console.log(e);
			});
	};
  
	return (
		<div>
			{alertContent === "modified" && (
				<Alert variant="success">
					{`Item successfully ${alertContent} on this site!`}
				</Alert>
			)}
			<Container>
				<Row>
					<Col>
						<div className="poster">
							<Image
								className="bigPicture"
								src={furniture.imageUrl}
								onError={({ currentTarget }) => {
									currentTarget.onerror = null;
									currentTarget.src = "/images/NoImageAvailable.jpg";
								}}
								fluid
							/>
						</div>
					</Col>
					<Col>
          <Card>
          {user &&
            (favorites.includes(furniture._id) ? (
              <BsHeartFill
                // style={{
                //   fill: "red",
                //   height: "40px",
                //   width: "50px",
                //   stroke: "red",
                //   strokeWidth: "0.1",
                //   top: "0px",
                //   right: "0px",
                // }}
                className="heart heartFill"
                // size={50}
                onClick={() => {
                  deleteFavorite(furniture._id);
                }}
              />
            ) : (
              <BsHeart
                className="heart heartEmpty"
                // style={{
                //   fill: "red",
                //   height: "40px",
                //   width: "50px",
                //   stroke: "red",
                //   strokeWidth: "0.1",
                //   top: "0px",
                //   right: "0px",
                // }}
                // size={50}
                onClick={() => {
                  addFavorite(furniture._id);
                }}
              />
            ))}
            <Card.Header>Save to wishlist</Card.Header>
            </Card>
						<Card>
							<Card.Header as="h4">{furniture.name}</Card.Header>{" "}
							<Card.Body>
								<Card.Text>Price: ${furniture.price}</Card.Text>
								{furniture.location ? (
									<Card.Text>
										Listed <Moment fromNow>{furniture.date}</Moment> in{" "}
										{furniture.location.address}
									</Card.Text>
								) : (
									<Card.Text>
										Listed <Moment fromNow>{furniture.date}</Moment>
									</Card.Text>
								)}

								<Card.Text>Details</Card.Text>
								<Card.Text>Condition: {furniture.condition}</Card.Text>
								<Card.Text>Category: {furniture.category}</Card.Text>
								<Card.Text>{furniture.description}</Card.Text>

								{furniture.location ? (
									<Container>
										<Map location={furniture.location} zoomLevel={15} />
										<Card.Text>{furniture.location.address}</Card.Text>
										<Card.Text>Location is approximate</Card.Text>
									</Container>
								) : (
									<Card.Text>Location Not Available</Card.Text>
								)}

								<Row>
									<Col>
										{user && furniture.user.googleId === user.googleId && (
											<Link
												className="edit"
												to={{ pathname: "/update" }}
												state={{
													to: "detailed_page",
													_id: furniture._id,
													user: furniture.user,
													name: furniture.name,
													price: furniture.price,
													description: furniture.description,
													category: furniture.category,
													imageUrl: furniture.imageUrl,
													condition: furniture.condition,
													location: furniture.location,
												}}
											>
												Edit
											</Link>
										)}
									</Col>
									<Col>
										{user && furniture.user.googleId === user.googleId && (
											<Button
												className="delete"
												variant="outline-secondary"
												size="sm"
												onClick={() => {
													deleteFurniture(furniture._id, user.googleId);
												}}
											>
												Delete
											</Button>
										)}
									</Col>
								</Row>
							</Card.Body>
							<Card.Header as="h5">Seller Information</Card.Header>
							<Card.Body>
								<Card.Text>
									Name: {nickname === "" ? furniture.user.name : nickname}
								</Card.Text>
								<Card.Text>
									Contact: {contact === "" ? furniture.user.email : contact}
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Furniture;
