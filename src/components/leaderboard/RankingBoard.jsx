import React from "react";
import { TbCoin } from "react-icons/tb";
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

function RankingBoard({
  leaders,
  loading,
  fullLeaders,
  totalElements,
  isLast,
  onLoadMore,
  onCollapse,
}) {
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
  }) => {
    const displayScore = score || 0;
    const absoluteImageUrl = profileImage
      ? makeAbsoluteImageUrl(profileImage)
      : profile;

    const toneMap = {
      gold: "bg-[#FEF9C3] border-[#FACC15]",
      silver: "bg-[#F3F4F6] border-[#D1D5DB]",
      bronze: "bg-[#FFE4D6] border-[#FDBA74]",
    };

    return (
      <div
        className={`w-[280px] h-[220px] p-6 flex flex-col items-center justify-center rounded-2xl shadow-sm border ${toneMap[tone]}`}
      >
        {/* 등수 배지 */}
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/70 text-[13px] font-bold border border-black/10">
          {rank}
        </span>

        {/* 프로필 이미지 */}
        <div className="mt-4 w-16 h-16 rounded-full bg-white/50 flex items-center justify-center border border-black/10 overflow-hidden">
          <img
            src={absoluteImageUrl}
            alt={`${name} profile`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        <div className="mt-4 text-center">
          <div className="text-[16px] font-semibold">{name}</div>
          <div className="flex items-center justify-center gap-1 text-[14px] text-[#4D4D4D] mt-1">
            <TbCoin size={14} />
            {displayScore.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  // 4위 이하 일반 리스트용 카드
  const RowCard = ({ rank, name, score, profileImage }) => {
    const absoluteImageUrl = profileImage
      ? makeAbsoluteImageUrl(profileImage)
      : profile;

    // grade가 없거나 이상한 값이면 '새싹 개발자' 스타일 적용 (default case)
    const badgeStyle = getGradeBadgeStyle(grade);

    return (
      <div className="flex items-center justify-between w-full px-10 py-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F3F4F6] text-[#374151] text-[13px] font-bold">
            {rank}
          </span>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] overflow-hidden">
              <img
                src={absoluteImageUrl}
                alt={`${name} profile`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="text-[15px] font-semibold">{name}</div>
          </div>

          {/* 등급 배지 */}
          {grade && (
            <span
              className={`text-[11px] px-2 py-[2px] rounded-full ${badgeStyle}`}
            >
              {grade}
            </span>
          )}
        </div>

        {/* 오른쪽 영역: 포인트 */}
        <div className="flex items-center justify-center gap-1 text-[14px] text-[#4D4D4D] mt-1">
          <TbCoin size={13} />
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
    <div className="mt-8">
      {/* 상단 TOP 3 영역 */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white/70 pt-4 pb-10">
        <div className="text-center mb-4">
          <h3 className="text-[14px] font-semibold">🏆 명예의 전당 TOP 3</h3>
        </div>

        <div className="flex items-end justify-center gap-4">
          <div className="translate-y-2">
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
              />
            )}
          </div>
          <div className="-translate-y-2">
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
              />
            )}
          </div>
          <div className="translate-y-2">
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
              />
            )}
          </div>
        </div>
      </div>

      {/* 전체 순위 영역 */}
      <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white/70">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
          <div className="text-[13px] text-[#111827]">전체 순위</div>
          <div className="text-[12px] text-[#6B7280]">
            {maxTotalCount}명 중{" "}
            {Math.min(maxTotalCount, 3 + currentDisplayedCount)}명 표시
          </div>
        </div>

        <div className="p-4 space-y-3">
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
              grade={item.grade}
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

        <div className="px-4 pb-4">
          <div className="mx-auto max-w-[360px] flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isAtMax || loading}
              className={`w-full px-4 py-2 rounded-lg border text-[13px] transition
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
              className={`w-full px-4 py-2 rounded-lg border text-[13px] transition
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
