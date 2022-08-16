import React, { useState, useEffect } from "react";
import FurnitureDataService from "../services/furniture";
import { useParams, Link, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Map from "./Map";
// import moment from 'moment';
import Moment from 'react-moment';
import ListGroup from 'react-bootstrap/ListGroup';
import "./Movie.css";

const Furniture = ({ user, deleteFavorite }) => {
	let params = useParams();

	const navigate = useNavigate();
	const [furniture, setFurniture] = useState({
		id: null,
		name: "",
		category: "",
		price: "",
		user: [],
		location: null,
	});

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

	const deleteFurniture = (objectId, googleId) => {
		let data = {
			objectId: objectId,
			userId: googleId,
		};
		deleteFavorite(objectId);
		FurnitureDataService.deleteItem(data)
			.then((res) => {
				navigate("/all_products");
			})
			.catch((e) => {
				console.log(e);
			});
	};
	return (
		<div>

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
							<Card.Header as="h4">{furniture.name}</Card.Header>
							<Card.Body>
                <Card.Text>Price: ${furniture.price}</Card.Text>
                {furniture.location ? 
                  <Card.Text>
									Listed <Moment fromNow>{furniture.date}</Moment> in {furniture.location.address}
								</Card.Text>
                    : 
                  <Card.Text>Listed <Moment fromNow>{furniture.date}</Moment></Card.Text>}

                <Card.Text>Details</Card.Text>
								<Card.Text>Condition: {furniture.condition}</Card.Text>
								<Card.Text>Category: {furniture.category}</Card.Text>
								<Card.Text>{furniture.description}</Card.Text>

                {furniture.location ? 
                  <Container>
                    <Map location={furniture.location} zoomLevel={15} />
                    <Card.Text>{furniture.location.address}</Card.Text>
                    <Card.Text>Location is approximate</Card.Text>
                  </Container>
                    : 
                  <Card.Text>Location Not Available</Card.Text>}
                  
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
								<Card.Text>Name: {furniture.user.name}</Card.Text>
								<Card.Text>Contact: {furniture.user.email}</Card.Text>
							</Card.Body>
						</Card>

					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Furniture;
