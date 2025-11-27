// 이미지 절대 경로 변환
export function makeAbsoluteImageUrl(rawPath) {
  if (!rawPath || rawPath === "null") return null;
  if (
    typeof rawPath === "string" &&
    (rawPath.startsWith("http://") || rawPath.startsWith("https://"))
  ) {
    return rawPath;
  }
  const rawBase = import.meta.env.VITE_API_BASE_URL || "";
  if (!rawBase) return null;
  const base = rawBase.replace(/\/api\/?$/i, "").replace(/\/+$/g, "");
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  return `${base}${path}`;
}
