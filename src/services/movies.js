import axios from "axios";

class MovieDataService {
	getAll(page = 0) {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?page=${page}`
		);
	}

	find(query, by = "name", page = 0) {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?${by}=${query}&page=${page}`
		);
	}

	getRatings() {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/ratings`
		);
	}

	getMovieById(id) {
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/id/${id}`
		);
	}

	createReview(data) {
		return axios.post(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`,
			data
		);
	}

	updateReview(data) {
		return axios.put(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`,
			data
		);
	}

	deleteReview(data) {
		return axios.delete(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`,
			data
		);
	}

	uploadItem(data) {
		return axios.post(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/upload`,
			data
		);
	}
}

export default new MovieDataService();
