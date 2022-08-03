import React from 'react';
import FavoritesList from './FavoritesList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';
import './Favorites.css';
import FavoritesDataService from '../services/favorites.js';

const Favorites = ({user}) => {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    FavoritesDataService.getFavorites(user.googleId)
      .then((response) => {
        setFavorites(response.data.favorites);
      })
      .catch(e => { 
        console.log(e);
      })
  }, [])


  return (
    <div>
      <Container className="favoritesContainer">
        <Row>
          <Col>
            <h3>Placeholder for User Info</h3>
          </Col>

          <Col>
          <div className="favoritesList">
            <h3>Wishlist</h3>
            <DndProvider backend={HTML5Backend}>
                <FavoritesList user = {user} favorites = {favorites}/>
              </DndProvider>
          </div>
          </Col>

          <Col>
            <h3>Placeholder for My Listings</h3>
          </Col>
          </Row>
      </Container>
    </div>
  )
}

export default Favorites;