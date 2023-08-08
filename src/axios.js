import axios from 'axios'
const baseURL = 'http://127.0.0.1:8000/api/'

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        // Do you have an access token in your local storage
        'Authorization': localStorage.getItem('access_token')
            // If yes pass it in authorization header prefixed with JWT as we setup in our backend
            ? 'JWT ' + localStorage.getItem('access_token')
            //if not 'you aren't logged in' >> pass null as value
            :null,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
})

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;
		if (typeof error.response === 'undefined') {
			console.log('unkown err / no server response')
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}
		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + 'token/refresh/'
		) {
			console.log('need new refresh');
			window.location.href = '/login/';
			return Promise.reject(error);
		}
		if (
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized' &&
			!originalRequest._retry
		) {
			console.log('need new access')
			originalRequest._retry = true;
			const refreshToken = localStorage.getItem('refresh_token');

			if (refreshToken) {
				console.log(' I have a refresh token')
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log(tokenParts.exp , now);

				if (tokenParts.exp > now) {
					console.log(refreshToken , 'iam a working refresh token')
					return axiosInstance
						.post('/token/refresh/', { refresh: refreshToken })
						.then((response) => {
							localStorage.setItem('access_token', response.data.access);
							localStorage.setItem('refresh_token', response.data.refresh);

							axiosInstance.defaults.headers['Authorization'] =
								'JWT ' + response.data.access;
							originalRequest.headers['Authorization'] =
								'JWT ' + response.data.access;
							console.log('obtained new access token')
							return axiosInstance(originalRequest);
						})
						.catch((err) => {
							console.log('failing this step');
							console.log(err.response);
						});
				} else {
					console.log('Refresh token is expired', tokenParts.exp, now);
					window.location.href = '/login/';
				}
			} else {
				console.log('Refresh token not available.');
				alert('PLease Login to view this page')
				window.location.href = '/login';
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;