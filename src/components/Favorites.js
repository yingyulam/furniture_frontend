import React from 'react';
import FavoritesList from './FavoritesList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from 'react-bootstrap/Container';
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

          <div className="favoritesPanel">
            {favorites.length === 0? 
              <p>You haven't chosen any favorites yet</p>
                : <p>Drag your favorites to rank them</p>}
          </div>
          
          <div className="favoritesList">
            <DndProvider backend={HTML5Backend}>
                <FavoritesList user = {user} favorites = {favorites}/>
              </DndProvider>
          </div>

      </Container>
    </div>
  )
}

export default Favorites;