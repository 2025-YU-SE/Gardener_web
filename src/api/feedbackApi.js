// src/api/feedbackApi.js
import api from "./axiosInterceptor";

// 피드백 생성
export const createFeedback = async ({ postId, content, rating, title, lineFeedbacks }) => {
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
export const getFeedbacksByPost = async (postId) => {
    const response = await api.get(`/api/feedback/post/${postId}`);
    return response.data;
};

// ⭐ 피드백 상세 조회
export const getFeedbackDetail = async (feedbackId) => {
    const response = await api.get(`/api/feedback/${feedbackId}`);
    return response.data;
};
