import axios from "axios";

class FavoritesDataService {

  updateFavorites(data) {
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorite`, data);
  }

  getFavorites(userId) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorite/${userId}`);
  }

}

export default new FavoritesDataService();