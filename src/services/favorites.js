import axios from "axios";

class FavoritesDataService {
	updateUserProfile(data) {
		return axios.put(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/profile`,
			data
		);
	}
	updateFavorites(data) {
		return axios.put(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/favorite`,
			data
		);
	}

	getFavorites(userId) {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/favorite/${userId}`
		);
	}
}

export default new FavoritesDataService();
