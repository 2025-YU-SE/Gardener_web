import api from "./axios";

// 메인 페이지 데이터 조회
export default async function fetchMain() {
  const { data } = await api.get("/main");
  return data;
}
