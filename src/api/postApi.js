import api from './axios';

// 📌 게시글 목록 조회 (GET /api/posts)
export const getPosts = () => {
    return api.get('/api/posts');
};

// 📌 게시글 상세 조회 (GET /api/posts/{postId})
export const getPostDetail = (postId) => {
    return api.get(`/api/posts/${postId}`);
};

// 📌 게시글 등록 (POST /api/posts)
export const createPost = (data) => {
    return api.post('/api/posts', data);
};

// 📌 게시글 좋아요 (POST /api/posts/{postId}/like)
export const likePost = (postId) => {
    return api.post(`/api/posts/${postId}/like`);
};

// 📌 게시글 북마크 (POST /api/posts/{postId}/bookmark)
export const bookmarkPost = (postId) => {
    return api.post(`/api/posts/${postId}/bookmark`);
};
