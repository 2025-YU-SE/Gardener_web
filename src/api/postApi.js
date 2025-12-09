import api from "./axios";

// 📌 게시글 목록 조회 (GET /api/posts)
export const getPosts = (config = {}) => {
  return api.get("/api/posts", config);
};

// 📌 게시글 상세 조회 (GET /api/posts/{postId})
export const getPostDetail = (postId) => {
  return api.get(`/api/posts/${postId}`);
};

// 📌 게시글 등록 (POST /api/posts)
export const createPost = (data) => {
  return api.post("/api/posts", data);
};

// 📌 게시글 좋아요 (POST /api/posts/{postId}/like)
export const likePost = (postId) => {
  return api.post(`/api/posts/${postId}/like`);
};

// 📌 게시글 스크랩 (POST /api/posts/{postId}/scrap)
export const bookmarkPost = (postId) => {
  return api.post(`/api/posts/${postId}/scrap`);
};

// 📌 게시글 수정 (PUT /api/posts/{postId})
export const updatePost = (postId, data) => {
  return api.put(`/api/posts/${postId}`, data);
};

// 📌 게시글 삭제 (DELETE /api/posts/{postId})
export const deletePost = (postId) => {
  return api.delete(`/api/posts/${postId}`);
};

// 📌 AI 피드백 조회 (GET /api/posts/{postId}/ai)
export const getAiFeedback = (postId) => {
  return api.get(`/api/posts/${postId}/ai`);
};

// 📌 AI 피드백 재생성 (POST /api/posts/{postId}/ai)
export const regenerateAiFeedback = (postId) => {
  return api.post(`/api/posts/${postId}/ai`);
};