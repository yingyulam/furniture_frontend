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
import Favorites from "./components/Favorites";
import UploadItem from "./components/UploadItem";

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
			FavoritesDataService.getFavorites(user.googleId)
				.then((response) => {
					console.log(response);
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
	}, [favorites, user]);

	useEffect(() => {
		retrieveFavorites();
	}, [retrieveFavorites]);

	useEffect(() => {
		updateFavorites();
	}, [updateFavorites]);

	return (
		<GoogleOAuthProvider clientId={clientId}>
			<div className="App">
				<Navbar bg="primary" expand="lg" sticky="top" variant="dark">
					<Container className="container-fluid">
						<Navbar.Brand className="brand" href="/">
							<img
								src="/images/movies-logo.png"
								alt="movies logo"
								className="moviesLogo"
							/>
							Once Upon A Furniture
						</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="responsive-navbar-nav">
							<Nav className="ml-auto">
								<Nav.Link as={Link} to={"/movies"}>
									All
								</Nav.Link>
								<Nav.Link as={Link} to={"/movies"}>
									Living Room
								</Nav.Link>
								<Nav.Link as={Link} to={"/movies"}>
									Dinning Room
								</Nav.Link>
								<Nav.Link as={Link} to={"/movies"}>
									Bedroom
								</Nav.Link>
								<Nav.Link as={Link} to={"/movies"}>
									Bathroom
								</Nav.Link>
								<Nav.Link as={Link} to={"/movies"}>
									Garden
								</Nav.Link>
								<Nav.Link as={Link} to={"/movies"}>
									Other
								</Nav.Link>
								{user && (
									<Nav.Link as={Link} to={"/favorites"}>
										Wishlist
									</Nav.Link>
								)}
							</Nav>
						</Navbar.Collapse>
						<Button href="/upload" variant="secondary">
							Sell
						</Button>
						{user ? <Logout setUser={setUser} /> : <Login setUser={setUser} />}
					</Container>
				</Navbar>

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
						path={"/movies"}
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
						path={"/favorites"}
						element={
							user ? (
								<Favorites user={user} />
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
					<Route path={"/movies/:id/"} element={<Furniture user={user} />} />
					<Route
						path={"/movies/:id/review"}
						element={<AddReview user={user} />}
					/>
				</Routes>
			</div>
		</GoogleOAuthProvider>
	);
}

export default App;
