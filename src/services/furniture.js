import axios from "axios";

class FurnitureDataService {
	find(queries, page) {
		const { title, condition, category } = queries;
		return axios.get(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture?title=${title}&condition=${condition}&category=${category}&page=${page}&furniturePerPage=20`
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

	uploadItem(data) {
		return axios.post(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/upload`,
			data
		);
	}

	updateItem(data) {
		return axios.put(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/update`,
			data
		);
	}

	deleteItem(data) {
		console.log(data);
		return axios.delete(
			`${process.env.REACT_APP_API_BASE_URL}/api/v1/furniture/delete`,
			{ data: data }
		);
	}
}

export default new FurnitureDataService();
