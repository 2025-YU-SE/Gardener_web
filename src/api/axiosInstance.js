import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseURL) {
    throw new Error('VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

const api = axios.create({
    baseURL: apiBaseURL,
});

export default api;
