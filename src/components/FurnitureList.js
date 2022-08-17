import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import FurnitureDataService from "../services/furniture";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import Moment from "react-moment";
import Alert from "react-bootstrap/Alert";
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
	const [alertContent, setAlertContent] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();

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
		const content = searchParams.get("alert");
		if (content !== "") {
			setAlertContent(content);
			setTimeout(() => {
				setAlertContent("");
			}, 5000);
		}
	}, []);

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

	// const deleteFurniture = (objectId, googleId, index) => {
	// 	let data = {
	// 		objectId: objectId,
	// 		userId: googleId,
	// 	};
	// 	deleteFavorite(objectId);
	// 	FurnitureDataService.deleteItem(data)
	// 		.then((res) => {
	// 			setFurniture((prevState) => {
	// 				prevState.splice(index, 1);
	// 				return [...prevState];
	// 			});
	// 		})
	// 		.catch((e) => {
	// 			console.log(e);
	// 		});
	// };

	useEffect(() => {
		sortFurnitureByFeature();
	}, [sortFurnitureByFeature]);

	return (
		<div className="App">
			{(alertContent === "created" ||
				alertContent === "modified" ||
				alertContent === "deleted") && (
				<Alert variant="success">
					{`Item successfully ${alertContent} on this site!`}
				</Alert>
			)}

			<Container className="main-container">
				<Form>
					<Row>
						<Col>
							<Form.Group className="mb-3">
								<Form.Control
									type="text"
									placeholder="Search Products"
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
							<Form.Group variant="light" className="mb-3">
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
							<Button
								variant="outline-secondary"
								type="button"
								onClick={clearFilter}
							>
								Clear all filters
							</Button>
						</Col>
					</Row>
				</Form>
				<Row className="movieRow">
					{furniture.length > 0 ? (
						furniture.map((furniture, index) => {
							return (
								<Col key={furniture._id}>
									<Card className="furnitureListCard" bg="light">
										<Card.Img
											className="smallPoster"
											src={furniture.imageUrl}
											onError={({ currentTarget }) => {
												currentTarget.onerror = null;
												currentTarget.src = "/images/NoImageAvailable.jpg";
											}}
										/>
										<Card.Body>
                    {user &&
											(favorites.includes(furniture._id) ? (
												<BsHeartFill
													className="star starFill"
													size={70}
													onClick={() => {
														deleteFavorite(furniture._id);
													}}
												/>
											) : (
												<BsHeart
													className="star starEmpty"
													size={70}
													onClick={() => {
														addFavorite(furniture._id);
													}}
												/>
											))}
                      <Card.Title>${furniture.price}</Card.Title>
											<Card.Text className="name"> {furniture.name} </Card.Text>
                      {furniture.location ? <Card.Text className="address">
													{furniture.location.address}
												</Card.Text> : <Card.Text className="address">Location not available</Card.Text>}
										</Card.Body>
										<Card.Footer>
											<small className="text-muted">
												Updated <Moment fromNow>{furniture.date}</Moment>
												<Button
													className="button"
													size="sm"
													href={"/furniture/" + furniture._id}
													variant="outline-secondary"
												>
													Details
												</Button>
											</small>
										</Card.Footer>
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
					{/* Get previous {entriesPerPage} results */}
          Previous
				</Button>
				{/* Showing page: {currentPage + 1} */}
        page {currentPage + 1}
				<Button
					variant="link"
					onClick={() => {
						setCurrentPage(currentPage + 1);
					}}
					disabled={furniture.length === 0}
				>
					{/* Get next {entriesPerPage} results */}
          Next
				</Button>
			</Container>
		</div>
	);
};

export default FurnitureList;
