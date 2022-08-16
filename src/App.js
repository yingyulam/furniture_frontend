import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

import Login from "./components/Login";
import Logout from "./components/Logout";

import FurnitureList from "./components/FurnitureList";
import Furniture from "./components/Furniture";
import AddReview from "./components/AddReview";
import FavoritesDataService from "./services/favorites";
import MyAccount from "./components/MyAccount";
import UploadItem from "./components/UploadItem";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Footer from "./components/Footer";
import "./App.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
	const [user, setUser] = useState(null);
	const [favorites, setFavorites] = useState([]);

	const addFavorite = (movieId) => {
		setFavorites([...favorites, movieId]);
	};

	const deleteFavorite = (movieId) => {
		setFavorites(favorites.filter((f) => f !== movieId));
	};

	useEffect(() => {
		let loginData = JSON.parse(localStorage.getItem("login"));
		if (loginData) {
			let loginExp = loginData.exp;
			let now = Date.now() / 1000;
			if (now < loginExp) {
				// Not expired
				setUser(loginData);
			} else {
				// Expired
				localStorage.setItem("login", null);
			}
		}
	}, []);

	const retrieveFavorites = useCallback(() => {
		if (user) {
			console.log(user);
			FavoritesDataService.getFavorites(user.googleId)
				.then((response) => {
					setFavorites(response.data.favorites);
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}, [user]);

	const updateFavorites = useCallback(() => {
		if (user) {
			FavoritesDataService.updateFavorites({
				_id: user.googleId,
				favorites: favorites,
			}).catch((e) => {
				console.log(e);
			});
		}
	}, [favorites]);

	useEffect(() => {
		retrieveFavorites();
	}, [retrieveFavorites]);

	useEffect(() => {
		updateFavorites();
	}, [updateFavorites]);

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<GoogleOAuthProvider clientId={clientId}>
			<div className="App">
				<div>
					<Navbar bg="light" variant="light" expand="lg">
						<Container className="container-fluid">
							<Navbar.Brand className="brand" href="/">
								<img
									src="/images/furniture_logo.png"
									alt="furniture logo"
									className="furnitureLogo"
								/>
							</Navbar.Brand>
							<Navbar.Toggle aria-controls="basic-navbar-nav" />
							{/* <Navbar.Collapse id="responsive-navbar-nav"> */}
							<Nav>
								{user ? (
									<NavDropdown
										title={`Hello, ${user.name}`}
										id="basic-nav-dropdown"
									>
										<NavDropdown.Item href="/profile">
											My Account
										</NavDropdown.Item>
										<NavDropdown.Item href="/all_products">
											All Products
										</NavDropdown.Item>
										<NavDropdown.Item href="/upload">Post Ad</NavDropdown.Item>
										<NavDropdown.Divider />
										<Logout setUser={setUser} />
									</NavDropdown>
								) : (
									<NavDropdown title="Sign in" id="basic-nav-dropdown">
										<Login setUser={setUser} />
									</NavDropdown>
								)}
								<Button variant="secondary" onClick={handleShow}>
									Post Ad
								</Button>

								<Modal
									show={show}
									onHide={handleClose}
									backdrop="static"
									keyboard={false}
								>
									{/* <Modal.Header closeButton>
                    <Modal.Title>Create item for sell on this website!</Modal.Title>
                  </Modal.Header> */}
									<Modal.Body>
										<UploadItem user={user} />
									</Modal.Body>
									<Modal.Footer>
										<Button variant="warning" onClick={handleClose}>
											Close
										</Button>
									</Modal.Footer>
								</Modal>
							</Nav>

							{/* <Navbar.Collapse>
                <Nav className="ml-auto">
                  <Nav.Link as={Link} to={"/all_products"}>
                    Products
                  </Nav.Link>

                  {user && (
                    <Nav.Link as={Link} to={"/profile"}>
                      My Account
                    </Nav.Link>
                  )}
                  </Nav> 
              </Navbar.Collapse>
              

              {user && (
                <Button href="/upload" variant="secondary">
                  + Create New Listing
                </Button>
              )}
              {user ? <Logout setUser={setUser} /> : <Login setUser={setUser} />} */}
						</Container>
					</Navbar>

					<Navbar className="title" bg="light" expand="lg" variant="light">
						<Container className="container-fluid">
							<Nav className="m-auto">
								<Nav.Link href="/">ONCE UPON A FURNITURE</Nav.Link>
							</Nav>
						</Container>
					</Navbar>

					<Navbar className="category" bg="light" expand="lg" variant="light">
						<Container className="container-fluid">
							{/* <Navbar.Brand className="brand">Once Upon A Furniture</Navbar.Brand> */}
							<Navbar.Toggle aria-controls="basic-navbar-nav" />
							<Navbar.Collapse id="responsive-navbar-nav">
								<Nav className="m-auto">
									<Nav.Link href="/all_products">All Products</Nav.Link>
									<Nav.Link href="/living_room">Living Room</Nav.Link>
									<Nav.Link href="/bedroom">Bedroom</Nav.Link>
									<Nav.Link href="/bathroom">Bathroom</Nav.Link>
									<Nav.Link href="/garden">Garden</Nav.Link>
									<Nav.Link href="/others">Others</Nav.Link>
								</Nav>
							</Navbar.Collapse>
						</Container>
					</Navbar>
				</div>

				<Routes>
					<Route
						exact
						path={"/"}
						element={
							<FurnitureList
								user={user}
								addFavorite={addFavorite}
								deleteFavorite={deleteFavorite}
								favorites={favorites}
							/>
						}
					/>
					<Route
						exact
						path={"/all_products"}
						element={
							<FurnitureList
								user={user}
								addFavorite={addFavorite}
								deleteFavorite={deleteFavorite}
								favorites={favorites}
								_category={"All Categories"}
							/>
						}
					/>
					<Route
						exact
						path={"/living_room"}
						element={
							<FurnitureList
								user={user}
								addFavorite={addFavorite}
								deleteFavorite={deleteFavorite}
								favorites={favorites}
								_category={"Living Room"}
							/>
						}
					/>
					<Route
						exact
						path={"/bedroom"}
						element={
							<FurnitureList
								user={user}
								addFavorite={addFavorite}
								deleteFavorite={deleteFavorite}
								favorites={favorites}
								_category={"Bedroom"}
							/>
						}
					/>
					<Route
						exact
						path={"/bathroom"}
						element={
							<FurnitureList
								user={user}
								addFavorite={addFavorite}
								deleteFavorite={deleteFavorite}
								favorites={favorites}
								_category={"Bathroom"}
							/>
						}
					/>
					<Route
						exact
						path={"/garden"}
						element={
							<FurnitureList
								user={user}
								addFavorite={addFavorite}
								deleteFavorite={deleteFavorite}
								favorites={favorites}
								_category={"Garden"}
							/>
						}
					/>
					<Route
						exact
						path={"/others"}
						element={
							<FurnitureList
								user={user}
								addFavorite={addFavorite}
								deleteFavorite={deleteFavorite}
								favorites={favorites}
								_category={"Others"}
							/>
						}
					/>
					<Route
						exact
						path={"/profile"}
						element={
							user ? (
								<MyAccount user={user} />
							) : (
								<FurnitureList
									user={user}
									addFavorite={addFavorite}
									deleteFavorite={deleteFavorite}
									favorites={favorites}
								/>
							)
						}
					/>
					<Route exact path={"/upload"} element={<UploadItem user={user} />} />
					<Route exact path={"/update"} element={<UploadItem user={user} />} />
					<Route
						path={"/furniture/:id/"}
						element={
							<Furniture
								user={user}
								favorites={favorites}
								addFavorite={addFavorite}
								deleteFavorite={deleteFavorite}
							/>
						}
					/>
					<Route
						path={"/furniture/:id/review"}
						element={<AddReview user={user} />}
					/>
				</Routes>
				<Footer />
			</div>
		</GoogleOAuthProvider>
	);
}

export default App;
