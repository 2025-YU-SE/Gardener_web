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
