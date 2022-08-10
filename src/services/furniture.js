import axios from "axios";

class FurnitureDataService {
	getAll(page = 0) {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture?page=${page}`
		);
	}

	find(query, by = "name", page = 0) {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture?${by}=${query}&page=${page}`
		);
	}

	getCategories() {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/categories`
		);
	}

	getConditions() {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/conditions`
		);
	}

	getFurnitureById(id) {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/id/${id}`
		);
	}

	getHistoryByUserId(googleId) {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/history/${googleId}`
		);
	}

	createReview(data) {
		return axios.post(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/review`,
			data
		);
	}

	updateReview(data) {
		return axios.put(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/review`,
			data
		);
	}

	deleteReview(data) {
		return axios.delete(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/review`,
			data
		);
	}

	uploadItem(data) {
		return axios.post(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/upload`,
			data
		);
	}
}

export default new FurnitureDataService();
