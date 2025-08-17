import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL;

// Variables for token refresh management
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('access_token')
            ? 'JWT ' + localStorage.getItem('access_token')
            : null,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
})

// Add response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        console.error('Axios error:', error);
        const originalRequest = error.config;

        // Handle network/server errors
        if (!error.response) {
            alert('Server/network error occurred. Please try again later.');
            return Promise.reject(error);
        }

        // Handle refresh token endpoint failure
        if (error.response.status === 401 && 
            originalRequest.url === `${baseURL}token/refresh/`) {
            console.error('Refresh token invalid');
            window.location.href = '/login/';
            return Promise.reject(error);
        }

        // Handle expired access token
        if (error.response.status === 401 && 
            error.response.statusText === 'Unauthorized' &&
            !originalRequest._retry) {
            
            // Check if refresh token exists
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                window.location.href = '/login/';
                return Promise.reject(error);
            }

            // Parse refresh token expiration
            let refreshTokenValid = true;
            try {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                const now = Math.ceil(Date.now() / 1000);
                refreshTokenValid = tokenParts.exp > now;
            } catch (e) {
                console.error('Token parsing error:', e);
                refreshTokenValid = false;
            }

            if (!refreshTokenValid) {
                window.location.href = '/login/';
                return Promise.reject(error);
            }

            // Mark request to prevent retry loops
            originalRequest._retry = true;

            // Handle concurrent token refreshes
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = 'JWT ' + token;
                    return axiosInstance(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            return new Promise((resolve, reject) => {
                axiosInstance
                    .post('/token/refresh/', { refresh: refreshToken })
                    .then(response => {
                        // Update tokens
                        localStorage.setItem('access_token', response.data.access);
                        localStorage.setItem('refresh_token', response.data.refresh);
                        
                        // Update default headers
                        axiosInstance.defaults.headers['Authorization'] = 
                            'JWT ' + response.data.access;
                        
                        // Update original request headers
                        originalRequest.headers['Authorization'] = 
                            'JWT ' + response.data.access;
                        
                        // Process queued requests
                        processQueue(null, response.data.access);
                        
                        // Retry original request
                        resolve(axiosInstance(originalRequest));
                    })
                    .catch(err => {
                        processQueue(err, null);
                        window.location.href = '/login/';
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;