import React from "react";
import { TbCoin } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/baseProfile.png";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";

// 등급별 배지 스타일 매핑 함수
const getGradeBadgeStyle = (grade) => {
  switch (grade) {
    case "숲의 현자":
      return "bg-[#DBEAFE] text-[#193CB8]";
    case "나무 개발자":
      return "bg-[#FEF3C7] text-[#92400E]";
    case "잎새 개발자":
      return "bg-[#D1FAE5] text-[#065F46]";
    case "새싹 개발자":
    default:
      return "bg-[#ECFCCB] text-[#4D7C0F]";
  }
};

// 포인트 값에 따른 등급 계산 함수
const getGradeByPoints = (points = 0) => {
  if (points >= 10000) return "숲의 현자";     // 10000 이상
  if (points >= 5000) return "나무 개발자";    // 5000 ~ 9999
  if (points >= 2000) return "잎새 개발자";    // 2000 ~ 4999
  return "새싹 개발자";                        // 0 ~ 1999
};

function RankingBoard({
  leaders,
  loading,
  fullLeaders,
  totalElements,
  isLast,
  onLoadMore,
  onCollapse,
}) {
  const navigate = useNavigate();

  const DEFAULT_DISPLAY_COUNT = 7;
  const top3Leaders = leaders.slice(0, 3);
  const first = top3Leaders[0];
  const second = top3Leaders[1];
  const third = top3Leaders[2];
  const rest = fullLeaders;

  // 현재 전체 순위 리스트에 표시된 항목의 총 수 (Top 3 제외)
  const currentDisplayedCount = rest.length;
  // API의 전체 항목 수
  const maxTotalCount = totalElements;
  const isExpanded = currentDisplayedCount > DEFAULT_DISPLAY_COUNT;
  const isAtMax = isLast; // 마지막 페이지이면 더보기 버튼 비활성화
  const isAtDefault = !isExpanded; // 기본 개수라면 접기 버튼 비활성화

  // 상단 Top 3 전용 카드
  const TopCard = ({
    rank,
    name,
    score,
    profileImage,
    grade,
    tone = "neutral",
    userId,
  }) => {
    const displayScore = score || 0;
    const absoluteImageUrl = profileImage
      ? makeAbsoluteImageUrl(profileImage)
      : profile;

    const toneMap = {
      gold: "bg-[#FEF9C3] border-[#FACC15]",
      silver: "bg-[#F3F4F6] border-[#D1D5DB]",
      bronze: "bg-[#FFE4D6] border-[#FDBA74]",
      neutral: "bg-white border-[#E5E7EB]",
    };

    return (
      <div
        className={`w-full max-w-[200px] sm:w-[240px] sm:h-[200px] md:w-[260px] md:h-[210px] lg:w-[280px] lg:h-[220px] flex-shrink-0 p-4 sm:p-5 md:p-6 lg:p-6 flex flex-col items-center justify-center rounded-2xl shadow-sm border cursor-pointer overflow-hidden ${toneMap[tone]}`}
        onClick={() => navigate(`/my-paged/${userId}`)}
      >
        {/* 등수 배지 */}
        <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 lg:w-8 lg:h-8 rounded-full bg-white/70 text-[11px] sm:text-[13px] lg:text-[13px] font-bold border border-black/10">
          {rank}
        </span>

        {/* 프로필 이미지 */}
        <div className="mt-3 sm:mt-4 lg:mt-4 w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 rounded-full bg-white/50 flex items-center justify-center border border-black/10 overflow-hidden">
          <img
            src={absoluteImageUrl}
            alt={`${name} profile`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        <div className="mt-3 sm:mt-4 lg:mt-4 text-center">
          <div className="text-sm sm:text-[16px] lg:text-[16px] font-semibold truncate w-full px-2">{name}</div>
          <div className="flex items-center justify-center gap-1 text-xs sm:text-[14px] lg:text-[14px] text-[#4D4D4D] mt-1">
            <TbCoin size={12} className="sm:w-[14px] sm:h-[14px] lg:w-[14px] lg:h-[14px]" />
            {displayScore.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  // 4위 이하 일반 리스트용 카드
  const RowCard = ({ rank, name, score, profileImage, grade, userId }) => {
    const absoluteImageUrl = profileImage
      ? makeAbsoluteImageUrl(profileImage)
      : profile;

    // grade가 없거나 이상한 값이면 '새싹 개발자' 스타일 적용 (default case)
    const badgeStyle = getGradeBadgeStyle(grade);

    return (
      <div
        className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-10 py-3 sm:py-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm cursor-pointer hover:bg-[#F9FAFB] transition"
        onClick={() => navigate(`/my-paged/${userId}`)}
      >
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#F3F4F6] text-[#374151] text-[11px] sm:text-[12px] lg:text-[13px] font-bold shrink-0">
            {rank}
          </span>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] overflow-hidden shrink-0">
              <img
                src={absoluteImageUrl}
                alt={`${name} profile`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="text-[13px] sm:text-[14px] lg:text-[15px] font-semibold truncate">{name}</div>
          </div>

          {/* 등급 배지 */}
          {grade && (
            <span
              className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-[2px] rounded-full ${badgeStyle} shrink-0 hidden sm:inline-block`}
            >
              {grade}
            </span>
          )}
        </div>

        {/* 오른쪽 영역: 포인트 */}
        <div className="flex items-center justify-center gap-1 text-xs sm:text-[13px] lg:text-[14px] text-[#4D4D4D] shrink-0 ml-2">
          <TbCoin size={11} className="sm:w-[12px] sm:h-[12px] lg:w-[13px] lg:h-[13px]" />
          {score.toLocaleString()}
        </div>
      </div>
    );
  };

  if (loading && top3Leaders.length === 0) {
    return (
      <div className="mt-12 text-center text-[#6B7280]">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (top3Leaders.length === 0 && maxTotalCount === 0) {
    return (
      <div className="mt-12 text-center text-[#6B7280]">
        <p>😭 아직 리더보드 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8">
      {/* 상단 TOP 3 영역 */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white/70 pt-4 pb-6 sm:pb-8 lg:pb-10 px-2 sm:px-4 overflow-hidden">
        <div className="text-center mb-4">
          <h3 className="text-xs sm:text-sm lg:text-[14px] font-semibold">🏆 명예의 전당 TOP 3</h3>
        </div>

        <div className="flex items-end justify-center gap-2 sm:gap-3 lg:gap-4 flex-wrap sm:flex-nowrap">
          <div className="translate-y-1 sm:translate-y-2">
            {second && (
              <TopCard
                rank={2}
                name={second.userName}
                score={
                  second.points ||
                  second.adoptedFeedbackCount ||
                  second.totalFeedbackCount
                }
                profileImage={second.userPicture}
                grade={second.grade}
                tone="silver"
                userId={second.userId}
              />
            )}
          </div>
          <div className="-translate-y-1 sm:-translate-y-2">
            {first && (
              <TopCard
                rank={1}
                name={first.userName}
                score={
                  first.points ||
                  first.adoptedFeedbackCount ||
                  first.totalFeedbackCount
                }
                profileImage={first.userPicture}
                grade={first.grade}
                tone="gold"
                userId={first.userId}
              />
            )}
          </div>
          <div className="translate-y-1 sm:translate-y-2">
            {third && (
              <TopCard
                rank={3}
                name={third.userName}
                score={
                  third.points ||
                  third.adoptedFeedbackCount ||
                  third.totalFeedbackCount
                }
                profileImage={third.userPicture}
                grade={third.grade}
                tone="bronze"
                userId={third.userId}
              />
            )}
          </div>
        </div>
      </div>

      {/* 전체 순위 영역 */}
      <div className="mt-4 sm:mt-6 rounded-xl border border-[#E5E7EB] bg-white/70">
        <div className="flex items-center justify-between px-4 sm:px-5 py-2 sm:py-3 border-b border-[#E5E7EB]">
          <div className="text-xs sm:text-[12px] lg:text-[13px] text-[#111827]">전체 순위</div>
          <div className="text-[11px] sm:text-[12px] text-[#6B7280]">
            {maxTotalCount}명 중{" "}
            {Math.min(maxTotalCount, 3 + currentDisplayedCount)}명 표시
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {rest.map((item, index) => (
            <RowCard
              key={item.userId}
              rank={index + 4}
              name={item.userName}
              score={
                item.points ||
                item.adoptedFeedbackCount ||
                item.totalFeedbackCount
              }
              profileImage={item.userPicture}
              // 포인트 값으로 등급 계산해서 전달
              grade={getGradeByPoints(item.points != null ? item.points : 0)}
              userId={item.userId}
            />
          ))}
          {loading && (
            <p className="text-center text-[#9CA3AF] py-4">
              다음 순위 목록을 불러오는 중입니다...
            </p>
          )}

          {maxTotalCount > 0 && currentDisplayedCount === 0 && !loading && (
            <p className="text-center text-[#9CA3AF] py-4">
              4위 이하 목록이 현재 순위 기준에 없습니다.
            </p>
          )}
        </div>

        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="mx-auto max-w-[360px] flex items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isAtMax || loading}
              className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-[13px] transition
                ${
                  isAtMax || loading
                    ? "bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                    : "bg-white border-[#D1D5DB] text-[#111827] hover:bg-[#F9FAFB]"
                }`}
            >
              더보기
            </button>

            <button
              type="button"
              onClick={onCollapse}
              disabled={isAtDefault}
              className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-[13px] transition
                ${
                  isAtDefault
                    ? "bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                    : "bg-[#4D4D4D] border-[#4B5563] text-white hover:opacity-90"
                }`}
            >
              접기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingBoard;
