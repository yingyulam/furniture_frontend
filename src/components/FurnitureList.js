import React, { useState, useEffect, useCallback } from "react";
import FurnitureDataService from "../services/furniture";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { BsStar, BsStarFill } from "react-icons/bs";
import "./FurnitureList.css";

const FurnitureList = ({ user, favorites, addFavorite, deleteFavorite }) => {
	// useState to set state values
	const [furniture, setFurniture] = useState([]);
	const [searchTitle, setSearchTitle] = useState("");
	const [searchCategory, setSearchCategory] = useState("");
	const [categories, setCategories] = useState(["All Categories"]);
  const [conditions, setConditions] = useState(["All Conditions"]);
  const [searchCondition, setSearchCondition] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [entriesPerPage, setEntriesPerPage] = useState(0);
	const [currentSearchMode, setCurrentSearchMode] = useState("");

	// useCallback to define functions which should only be created once
	// and will be dependencies for useEffect

	const retrieveCategories = useCallback(() => {
		FurnitureDataService.getCategories()
			.then((response) => {
				setCategories(["All Categories"].concat(response.data));
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

  const retrieveConditions = useCallback(() => {
		FurnitureDataService.getConditions()
			.then((response) => {
				setConditions(["All Conditions"].concat(response.data));
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	const retrieveFurniture = useCallback(() => {
		setCurrentSearchMode("");
		FurnitureDataService.getAll(currentPage)
			.then((response) => {
				setFurniture(response.data.furniture);
				setCurrentPage(response.data.page);
				setEntriesPerPage(response.data.entries_per_page);
			})
			.catch((e) => {
				console.log(e);
			});
	}, [currentPage]);

	const find = useCallback(
		(query, by) => {
			FurnitureDataService.find(query, by, currentPage)
				.then((response) => {
					setFurniture(response.data.furniture);
				})
				.catch((e) => {
					console.log(e);
				});
		},
		[currentPage]
	);

	const findByTitle = useCallback(() => {
		setCurrentSearchMode("findByTitle");
		find(searchTitle, "name");
	}, [find, searchTitle]);

	const findByCategory = useCallback(() => {
		setCurrentSearchMode("findByCategory");
		if (searchCategory === "All Categories") {
			retrieveFurniture();
		} else {
			find(searchCategory, "category");
		}
	}, [find, searchCategory, retrieveFurniture]);

  const findByCondition = useCallback(() => {
		setCurrentSearchMode("findByCondition");
		if (searchCondition === "All Conditions") {
			retrieveFurniture();
		} else {
			find(searchCondition, "condition");
		}
	}, [find, searchCondition, retrieveFurniture]);

	const retrieveNextPage = useCallback(() => {
		if (currentSearchMode === "findByTitle") {
			findByTitle();
		} else if (currentSearchMode === "findByCategory") {
			findByCategory();
		} else if (currentSearchMode === "findByCondition") {
      findByCondition();
    } else {
			retrieveFurniture();
		}
	}, [currentSearchMode, findByTitle, findByCategory, findByCondition, retrieveFurniture]);

	//Use effect to carry out side effect functionality
	useEffect(() => {
		retrieveCategories();
	}, [retrieveCategories]);

  useEffect(() => {
		retrieveConditions();
	}, [retrieveConditions]);

	useEffect(() => {
		setCurrentPage(0);
	}, [currentSearchMode]);

	// Retrieve the next page if currentPage value changes
	useEffect(() => {
		retrieveNextPage();
	}, [currentPage, retrieveNextPage]);

	// Other functions that are not depended on by useEffect
	const onChangeSearchTitle = (e) => {
		const searchTitle = e.target.value;
		setSearchTitle(searchTitle);
	};

	const onChangeSearchCategory = (e) => {
		const searchCategory = e.target.value;
		setSearchCategory(searchCategory);
	};

  const onChangeSearchCondition = (e) => {
    const searchCondition = e.target.value;
    setSearchCondition(searchCondition);
  }

	return (
		<div className="App">
			<Container className="main-container">
				<Form>
					<Row>
						<Col>
							<Form.Group className="mb-3">
								<Form.Control
									type="text"
									placeholder="Search by title"
									value={searchTitle}
									onChange={onChangeSearchTitle}
								/>
							</Form.Group>
							<Button variant="primary" type="button" onClick={findByTitle}>
								Search
							</Button>
						</Col>
						<Col>
							<Form.Group className="mb-3">
								<Form.Control as="select" onChange={onChangeSearchCategory}>
									{categories.map((category, i) => {
										return (
											<option value={category} key={i}>
												{category}
											</option>
										);
									})}
								</Form.Control>
							</Form.Group>
							<Button variant="primary" type="button" onClick={findByCategory}>
								Search
							</Button>
						</Col>

            <Col>
							<Form.Group className="mb-3">
								<Form.Control as="select" onChange={onChangeSearchCondition}>
									{conditions.map((condition, i) => {
										return (
											<option value={condition} key={i}>
												{condition}
											</option>
										);
									})}
								</Form.Control>
							</Form.Group>
							<Button variant="primary" type="button" onClick={findByCondition}>
								Search
							</Button>
						</Col>

					</Row>
				</Form>
				<Row className="movieRow">
					{furniture.map((furniture) => {
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
											currentTarget.src = "/images/NoPosterAvailable-crop.jpg";
										}}
									/>
									<Card.Body>
										<Card.Title> {furniture.name} </Card.Title>
										<Card.Text>Price: ${furniture.price}</Card.Text>
										<Card.Text>{furniture.description}</Card.Text>
										<Link to={"/furniture/" + furniture._id}>View Product</Link>
									</Card.Body>
								</Card>
							</Col>
						);
					})}
				</Row>
				<br />
				Showing page: {currentPage + 1},
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
