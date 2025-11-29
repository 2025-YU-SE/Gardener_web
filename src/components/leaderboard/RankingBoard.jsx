import React, { useMemo, useState } from "react";
import samplePosts from "../postcontext.jsx";
import { TbCoin } from "react-icons/tb";
import profile from "../../assets/baseProfile.png";
import { makeAbsoluteImageUrl } from "../../utils/imageHelper";
function rankByPoints(posts) {
  return [...posts]
    .sort((a, b) => b.points - a.points)
    .map((post, idx) => ({
      rank: idx + 1,
      name: post.author,
      score: post.points,
      profileImage: profile,
    }));
}

function RankingBoard({ leaders, loading }) {
  const fullMockedRanked = useMemo(() => rankByPoints(samplePosts), []);

  const DEFAULT_COUNT = 10; // 기본 표시 인원
  const MAX_EXPANDED = 50; // 더보기로 펼칠 수 있는 최대 인원

  // 전체 순위에서 표시할 총 인원(Top3 포함)
  const [showCount, setShowCount] = useState(DEFAULT_COUNT);

  // 상단 Top3 데이터
  const top3Leaders = leaders.slice(0, 3);
  const first = top3Leaders[0];
  const second = top3Leaders[1];
  const third = top3Leaders[2];

  // 목록 데이터
  const rest = fullMockedRanked.slice(
    3,
    Math.min(showCount, fullMockedRanked.length)
  );

  const maxShowable = Math.min(fullMockedRanked.length, MAX_EXPANDED);
  const isAtDefault = showCount === DEFAULT_COUNT;
  const isAtMax = showCount >= maxShowable;
  const handleMore = () => setShowCount(maxShowable);
  const handleCollapse = () => setShowCount(DEFAULT_COUNT);

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
      gold: "bg-[#FEF9C3] border-[#FACC15]", // 1등
      silver: "bg-[#F3F4F6] border-[#D1D5DB]", // 2등
      bronze: "bg-[#FFE4D6] border-[#FDBA74]", // 3등
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

        {/* 이름 + 포인트 */}
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

    return (
      <div className="flex items-center justify-between w-full px-10 py-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-4">
          {/* 등수 배지 */}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F3F4F6] text-[#374151] text-[13px] font-bold">
            {rank}
          </span>

          {/* 프로필 이미지 + 이름 */}
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

          {/* 등급 배지 -> 추후 연동 */}
          <span className="text-[11px] px-2 py-[2px] rounded-full bg-[#DBEAFE] text-[#193CB8]">
            숲의 현자
          </span>
        </div>

        {/* 오른쪽 영역: 포인트 */}
        <div className="flex items-center justify-center gap-1 text-[14px] text-[#4D4D4D] mt-1">
          <TbCoin size={13} />
          {score.toLocaleString()}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-12 text-center text-[#6B7280]">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (top3Leaders.length === 0 && fullMockedRanked.length === 0) {
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
            {/* 2위: API 데이터 사용 */}
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
                tone="silver"
              />
            )}
          </div>
          <div className="-translate-y-2">
            {/* 1위: API 데이터 사용 */}
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
                tone="gold"
              />
            )}
          </div>
          <div className="translate-y-2">
            {/* 3위: API 데이터 사용 */}
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
                tone="bronze"
              />
            )}
          </div>
        </div>
      </div>

      {/* 전체 순위 영역 */}
      <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white/70">
        {/* 헤더: 제목 + 표시 인원 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
          <div className="text-[13px] text-[#111827]">전체 순위</div>
          <div className="text-[12px] text-[#6B7280]">
            {/* 목업 데이터 전체 길이를 사용 */}
            {fullMockedRanked.length}명 중 {Math.min(showCount, maxShowable)}명
            표시
          </div>
        </div>

        {/* 리스트 */}
        <div className="p-4 space-y-3">
          {rest.map((item) => (
            <RowCard key={item.rank} {...item} />
          ))}
        </div>

        {/* 더보기 / 접기 버튼 */}
        <div className="px-4 pb-4">
          <div className="mx-auto max-w-[360px] flex items-center justify-center gap-3">
            {/* 더보기 */}
            <button
              type="button"
              onClick={handleMore}
              disabled={isAtMax}
              className={`w-full px-4 py-2 rounded-lg border text-[13px] transition
                ${
                  isAtMax
                    ? "bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                    : "bg-white border-[#D1D5DB] text-[#111827] hover:bg-[#F9FAFB]"
                }`}
            >
              더보기
            </button>

            {/* 접기 */}
            <button
              type="button"
              onClick={handleCollapse}
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
