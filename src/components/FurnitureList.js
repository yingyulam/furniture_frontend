import React, { useState, useEffect, useCallback } from "react";
import FurnitureDataService from "../services/furniture";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsStar, BsStarFill } from "react-icons/bs";
import "./FurnitureList.css";

const FurnitureList = ({
	user,
	favorites,
	addFavorite,
	deleteFavorite,
	_category = "All Categories",
}) => {
	// useState to set state values
	const [furniture, setFurniture] = useState([]);
	const [searchTitle, setSearchTitle] = useState("");
	const [searchCategory, setSearchCategory] = useState(_category);
	const [conditions, setConditions] = useState(["All Conditions"]);
	const [searchCondition, setSearchCondition] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [entriesPerPage, setEntriesPerPage] = useState(20);
	const [sortFurniture, setSortFurniture] = useState("Sort By: Feature");
	// useCallback to define functions which should only be created once
	// and will be dependencies for useEffect

	const features = [
		"Sort by: Feature",
		"Price: Low to High",
		"Price: High to Low",
		"Newest to Oldest",
		"Oldest to Newest",
	];

	const retrieveConditions = useCallback(() => {
		FurnitureDataService.getConditions()
			.then((response) => {
				setConditions(["All Conditions"].concat(response.data));
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	const findByQueries = useCallback(() => {
		const queries = {
			title: searchTitle,
			condition: searchCondition,
			category: searchCategory,
		};
		FurnitureDataService.find(queries, currentPage)
			.then((response) => {
				setFurniture(response.data.furniture);
				setCurrentPage(response.data.page);
				setEntriesPerPage(response.data.entries_per_page);
			})
			.catch((e) => {
				console.log(e);
			});
	}, [currentPage, searchTitle, searchCondition, searchCategory]);

	const clearFilter = useCallback(() => {
		setSearchTitle("");
		setSearchCondition("All Conditions");
		setSortFurniture("Sort by: Feature");
	}, [setSearchTitle, setSearchCondition, setSortFurniture]);

	const retrieveDifferentPage = useCallback(() => {
		findByQueries();
	}, [findByQueries]);

	// //Use effect to carry out side effect functionality
	// useEffect(() => {
	// 	retrieveCategories();
	// }, [retrieveCategories]);

	useEffect(() => {
		retrieveConditions();
	}, [retrieveConditions]);

	// Retrieve the next page if currentPage value changes
	useEffect(() => {
		retrieveDifferentPage();
	}, [currentPage, retrieveDifferentPage]);

	// Other functions that are not depended on by useEffect
	const onChangeSearchTitle = (e) => {
		const searchTitle = e.target.value;
		setSearchTitle(searchTitle);
	};

	// const onChangeSearchCategory = (e) => {
	// 	const searchCategory = e.target.value;
	// 	setSearchCategory(searchCategory);
	// };

	const onChangeSearchCondition = useCallback(
		(e) => {
			const searchCondition = e.target.value;
			setSearchCondition(searchCondition);
		},
		[setSearchCondition]
	);

	const onChangeSortFurniture = useCallback(
		(e) => {
			const feature = e.target.value;
			setSortFurniture(feature);
		},
		[setSortFurniture]
	);

	const sortFurnitureByFeature = useCallback(() => {
		let furnitureList = furniture;
		const queries = {
			title: searchTitle,
			condition: searchCondition,
			category: searchCategory,
		};
		FurnitureDataService.find(queries, currentPage)
			.then((response) => {
				setFurniture(response.data.furniture);
				setCurrentPage(response.data.page);
				setEntriesPerPage(response.data.entries_per_page);
				if (sortFurniture === "Price: Low to High") {
					furnitureList.sort((a, b) => a.price - b.price);
					setFurniture(furnitureList);
				} else if (sortFurniture === "Price: High to Low") {
					furnitureList.sort((a, b) => b.price - a.price);
					setFurniture(furnitureList);
				} else if (sortFurniture === "Oldest to Newest") {
					furnitureList.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
					setFurniture(furnitureList);
				} else if (sortFurniture === "Newest to Oldest") {
					furnitureList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
					setFurniture(furnitureList);
				}
				// furniture.map((fur, i) => {
				//   console.log(Date.parse(fur.date))
				// })
			})
			.catch((e) => {
				console.log(e);
			});
	}, [sortFurniture]);

	useEffect(() => {
		sortFurnitureByFeature();
	}, [sortFurnitureByFeature]);

	return (
		<div className="App">
			<Navbar bg="secondary" expand="lg" variant="dark">
				<Container className="container-fluid">
					<Navbar.Brand className="brand">Furniture Categories</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="ml-auto sidebar">
							<Nav.Link href="/all_products">All Products</Nav.Link>
							<Nav.Link href="/living_room">Living Room</Nav.Link>
							<Nav.Link href="/bedroom">Bedroom</Nav.Link>
							<Nav.Link href="/bathroom">Bathroom</Nav.Link>
							<Nav.Link href="/garden">Garden</Nav.Link>
							<Nav.Link href="/others">Other Products</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Container className="main-container">
				<Form>
					<Row>
						<Col>
							<Form.Group className="mb-3">
								<Form.Control
									type="text"
									placeholder="Filter by title"
									value={searchTitle}
									onChange={onChangeSearchTitle}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className="mb-3">
								<Form.Control
									as="select"
									onChange={onChangeSearchCondition}
									value={searchCondition}
								>
									{conditions.map((condition, i) => {
										return (
											<option value={condition} key={i}>
												{condition}
											</option>
										);
									})}
								</Form.Control>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group className="mb-3">
								<Form.Control
									as="select"
									onChange={onChangeSortFurniture}
									value={sortFurniture}
								>
									{features.map((feature, i) => {
										return (
											<option value={feature} key={i}>
												{feature}
											</option>
										);
									})}
								</Form.Control>
							</Form.Group>
						</Col>
						<Col>
							<Button variant="warning" type="button" onClick={clearFilter}>
								Clear all filters
							</Button>
						</Col>
					</Row>
				</Form>
				<Row className="movieRow">
					{furniture.length > 0 ? (
						furniture.map((furniture) => {
							return (
								<Col key={furniture._id}>
									<Card className="moviesListCard">
										{user &&
											(favorites.includes(furniture._id) ? (
												<BsStarFill
													className="star starFill"
													onClick={() => {
														deleteFavorite(furniture._id);
													}}
												/>
											) : (
												<BsStar
													className="star starEmpty"
													onClick={() => {
														addFavorite(furniture._id);
													}}
												/>
											))}
										<Card.Img
											className="smallPoster"
											src={furniture.imageUrl}
											onError={({ currentTarget }) => {
												currentTarget.onerror = null;
												currentTarget.src =
													"/images/NoPosterAvailable-crop.jpg";
											}}
										/>
										<Card.Body>
											<Card.Title> {furniture.name} </Card.Title>
											<Card.Text>Price: ${furniture.price}</Card.Text>
											<Card.Text>{furniture.description}</Card.Text>
											<Link to={"/furniture/" + furniture._id}>
												View Product
											</Link>
										</Card.Body>
									</Card>
								</Col>
							);
						})
					) : (
						<h3>Oops.. Wait for it to come</h3>
					)}
				</Row>
				<br />
				<Button
					variant="link"
					disabled={currentPage <= 0}
					onClick={() => {
						setCurrentPage(currentPage - 1);
					}}
				>
					Get previous {entriesPerPage} results
				</Button>
				Showing page: {currentPage + 1}
				<Button
					variant="link"
					onClick={() => {
						setCurrentPage(currentPage + 1);
					}}
				>
					Get next {entriesPerPage} results
				</Button>
			</Container>
		</div>
	);
};

export default FurnitureList;
