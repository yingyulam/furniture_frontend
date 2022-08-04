import React from 'react';
import FavoritesList from './FavoritesList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { useState, useEffect } from 'react';
import './Favorites.css';
import FavoritesDataService from '../services/favorites.js';

const MyAccount = ({user}) => {

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
            <Card>
              <Card.Header as="h5">My Account</Card.Header>
              <Card.Body>
                <Card.Text>
                  Name: {user.name}
                </Card.Text>
                <Card.Text>
                  Email: {user.email}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
          <div className="favoritesList">
            <h3>My Wishlist</h3>
            <DndProvider backend={HTML5Backend}>
                <FavoritesList user = {user} favorites = {favorites}/>
              </DndProvider>
          </div>
          </Col>

          <Col>
            <h3>My Listings</h3>
          </Col>
          </Row>
      </Container>
    </div>
  )
}

export default MyAccount;