import api from './axios';

/* ====================================
   ==========  AUTH / USER  ============
   ==================================== */

// ⭐ 1. 회원가입
export const signup = (data) => {
    return api.post('/api/user/signup', data);
};
// data: { userName, email, password }


// ⭐ 2. 로그인 (JWT 토큰 발급)
export const login = async (data) => {
    const res = await api.post('/api/user/login', data);

    // {"accessToken": "..."} 저장
    localStorage.setItem("accessToken", res.data.accessToken);

    return res;
};


// ⭐ 3. 출석 체크
export const attendance = () => {
    return api.post('/api/user/attendance');
};


// ⭐ 4. 특정 유저 프로필 조회
export const getUserProfile = (userId) => {
    return api.get(`/api/user/${userId}`);
};


/* ====================================
        USER POSTS (작성 글)
   ==================================== */

// ⭐ 유저 최근 게시물
export const getUserRecentPosts = (userId) => {
    return api.get(`/api/user/${userId}/posts/recent`);
};

// ⭐ 유저 게시물 목록 (Pageable)
export const getUserPosts = (userId, page = 0, size = 10) => {
    return api.get(`/api/user/${userId}/posts`, {
        params: { page, size }
    });
};


/* ====================================
        USER FEEDBACKS (작성 피드백)
   ==================================== */

// ⭐ 유저 최근 피드백
export const getUserRecentFeedbacks = (userId) => {
    return api.get(`/api/user/${userId}/feedbacks/recent`);
};

// ⭐ 유저 피드백 목록 (Pageable)
export const getUserFeedbacks = (userId, page = 0, size = 10) => {
    return api.get(`/api/user/${userId}/feedbacks`, {
        params: { page, size }
    });
};


/* ====================================
            USER SCRAPS (스크랩)
   ==================================== */

// ⭐ 유저 최근 스크랩
export const getUserRecentScraps = (userId) => {
    return api.get(`/api/user/${userId}/scraps/recent`);
};

// ⭐ 유저 스크랩 목록 (Pageable)
export const getUserScraps = (userId, page = 0, size = 10) => {
    return api.get(`/api/user/${userId}/scraps`, {
        params: { page, size }
    });
};


/* ====================================
            USER DELETE
   ==================================== */

// ⭐ 본인 계정 삭제
export const deleteMyAccount = () => {
    return api.delete(`/api/user/me`);
};

// ⭐ 관리자 권한으로 특정 사용자 삭제
export const deleteUserAsAdmin = (userId) => {
    return api.delete(`/api/user/${userId}/admin`);
};
