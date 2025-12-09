// src/api/feedbackApi.js
import api from "./axiosInterceptor";

// 피드백 생성
export const createFeedback = async ({
  postId,
  content,
  rating,
  title,
  lineFeedbacks,
}) => {
  const response = await api.post("/api/feedback", {
    postId,
    content,
    rating,
    title,
    lineFeedbacks,
  });
  return response.data;
};

// ⭐ 라인피드백 생성 (JWT 필요하므로 api 사용)
export const createLineFeedback = async (feedbackId, lineFeedback) => {
  const response = await api.post(`/api/feedback/${feedbackId}/line`, lineFeedback);
  return response.data;
};

// ⭐ 특정 게시물의 피드백 목록 조회 (일관성 유지 위해 api 사용)
export const getFeedbacksByPost = async (postId, params) => {
  const response = await api.get(`/api/feedback/post/${postId}`, { params });
  return response.data;
};

// ⭐ 피드백 상세 조회
export const getFeedbackDetail = async (feedbackId) => {
  const response = await api.get(`/api/feedback/${feedbackId}`);
  return response.data;
};

// ⭐ 특정 피드백의 라인피드백 목록 조회
export const getLineFeedbacks = async (feedbackId) => {
  const response = await api.get(`/api/feedback/${feedbackId}/lines`);
  return response.data;
};

// ⭐ 피드백 채택
export const adoptFeedback = async (feedbackId) => {
  const response = await api.post(`/api/feedback/${feedbackId}/adopt`);
  return response.data;
};

// ⭐ 피드백 수정 (PUT /api/feedback/{feedbackId})
export const updateFeedback = async (feedbackId, data) => {
  const response = await api.put(`/api/feedback/${feedbackId}`, data);
  return response.data;
};

// ⭐ 피드백 삭제 (DELETE /api/feedback/{feedbackId})
export const deleteFeedback = async (feedbackId) => {
  const response = await api.delete(`/api/feedback/${feedbackId}`);
  return response.data;
};

// ⭐ 모든 피드백 목록 조회 (관리자용)
export const getAllFeedbacks = async (params) => {
  const response = await api.get("/api/feedback", { params });
  return response.data;
};