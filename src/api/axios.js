import axios from 'axios';

const api = axios.create({
    baseURL: '/', // proxy 통해 자동으로 8080으로 전달
    withCredentials: false
});

// JWT 토큰 자동 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
