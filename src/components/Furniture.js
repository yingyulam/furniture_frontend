import React, { useState, useEffect } from "react";
import FurnitureDataService from "../services/furniture";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Map from "./Map";
// import { Wrapper, Status } from "@googlemaps/react-wrapper";
import "./Movie.css";

const Furniture = ({ user }) => {
	let params = useParams();

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

	// const mapKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

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
									currentTarget.src = "/images/NoPosterAvailable-crop.jpg";
								}}
								fluid
							/>
						</div>
					</Col>
					<Col>
						<Card>
							<Card.Header as="h3">{furniture.name}</Card.Header>
							<Card.Body>
								{furniture.location && (
									<Card.Text>Location: {furniture.location.address}</Card.Text>
								)}
								<Card.Text>Price: ${furniture.price}</Card.Text>
								<Card.Text>Condition: {furniture.condition}</Card.Text>
								<Card.Text>Category: {furniture.category}</Card.Text>
								<Card.Text>Uploaded time: {furniture.date}</Card.Text>
								<Card.Text>{furniture.description}</Card.Text>

								{/* { user &&
                  <Link to={"/movies/" + params.id + "/review"} >
                    Add Review
                  </Link>} */}
							</Card.Body>
						</Card>

						<Card>
							<Card.Header as="h5">Seller Information</Card.Header>
							<Card.Body>
								<Card.Text>Name: {furniture.user.name}</Card.Text>
								<Card.Text>Contact: {furniture.user.email}</Card.Text>
							</Card.Body>
						</Card>

						{furniture.location && (
							<Map location={furniture.location} zoomLevel={15} />
						)}
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Furniture;
