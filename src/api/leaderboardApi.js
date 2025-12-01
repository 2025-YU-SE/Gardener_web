import api from "./axios";

// 리더보드 TOP 3 사용자 목록 조회
export const getTop3Leaders = async (criteria = "points") => {
  const response = await api.get("/api/leaderboard/top3", {
    params: {
      sortBy: criteria,
    },
  });
  return response.data;
};

// 리더보드 전체 목록 조회 (페이징 포함)
export const getFullLeaders = async (
  criteria = "points",
  page = 0,
  size = 20
) => {
  const response = await api.get("/api/leaderboard", {
    params: {
      sortBy: criteria,
      page: page,
      size: size,
    },
  });
  return response.data;
};

// 이번 주 피드백 수 조회
export async function getWeeklyFeedbackCount() {
  const res = await api.get("api/feedback/week");
  return res.data;
}
