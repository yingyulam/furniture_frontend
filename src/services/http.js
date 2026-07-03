import axios from "axios";

// Render's free tier sleeps after ~15 min idle; the first request while it wakes
// can be slow or return a transient 5xx. Give requests a generous timeout and
// automatically retry network errors / 5xx a few times so the UI fills in on its
// own instead of showing an empty page. (404s and other 4xx are NOT retried.)
axios.defaults.timeout = 45000;

const MAX_RETRIES = 4;
const RETRY_BASE_MS = 2500;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const config = error.config;
		if (!config) return Promise.reject(error);

		const isNetworkOrTimeout = !error.response; // no response = network err / timeout
		const isServerError =
			error.response &&
			error.response.status >= 500 &&
			error.response.status < 600;

		if (!isNetworkOrTimeout && !isServerError) {
			return Promise.reject(error); // don't retry 4xx (e.g. 404 favorites)
		}

		config.__retryCount = config.__retryCount || 0;
		if (config.__retryCount >= MAX_RETRIES) {
			return Promise.reject(error);
		}
		config.__retryCount += 1;

		const delay = RETRY_BASE_MS * config.__retryCount; // 2.5s, 5s, 7.5s, 10s
		await new Promise((resolve) => setTimeout(resolve, delay));
		return axios(config);
	}
);

export default axios;
