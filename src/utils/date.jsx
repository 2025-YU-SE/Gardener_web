// 날짜 문자열 -> "n분 전", "n시간 전", "n일 전" 형식으로 변환
export function timeAgo(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}
