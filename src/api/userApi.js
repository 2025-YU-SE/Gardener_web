import api from "./axios";

// 회원가입
export const signup = (data) => {
  return api.post("/api/user/signup", data);
};

// 아이디 중복 확인
export const checkUsername = (userName) => {
  return api.get("/api/user/check-username", {
    params: { userName },
  });
};

// 이메일 중복 확인
export const checkEmail = (email) => {
  return api.get("/api/user/check-email", {
    params: { email },
  });
};

// 로그인
export const login = async (data) => {
  const res = await api.post("/api/user/login", data);
  localStorage.setItem("accessToken", res.data.accessToken);
  return res;
};

// 출석 체크
export const attendance = () => {
  return api.post("/api/user/attendance");
};

// 특정 유저 프로필 조회
export const getUserProfile = (userId) => {
  return api.get(`/api/user/${userId}`);
};

// 유저 최근 게시물
export const getUserRecentPosts = (userId) => {
  return api.get(`/api/user/${userId}/posts/recent`);
};

// 유저 게시물 목록 (Pageable)
export const getUserPosts = (userId, page = 0, size = 10) => {
  return api.get(`/api/user/${userId}/posts`, {
    params: { page, size },
  });
};

// 유저 최근 피드백
export const getUserRecentFeedbacks = (userId) => {
  return api.get(`/api/user/${userId}/feedbacks/recent`);
};

// 유저 피드백 목록 (Pageable)
export const getUserFeedbacks = (userId, page = 0, size = 10) => {
  return api.get(`/api/user/${userId}/feedbacks`, {
    params: { page, size },
  });
};

// 유저 최근 스크랩
export const getUserRecentScraps = (userId) => {
  return api.get(`/api/user/${userId}/scraps/recent`);
};

// 유저 스크랩 목록 (Pageable)
export const getUserScraps = (userId, page = 0, size = 10) => {
  return api.get(`/api/user/${userId}/scraps`, {
    params: { page, size },
  });
};

// 본인 계정 삭제
export const deleteMyAccount = () => {
  return api.delete(`/api/user/me`);
};

// 관리자 권한으로 특정 사용자 삭제
export const deleteUserAsAdmin = (userId) => {
  return api.delete(`/api/user/${userId}/admin`);
};
