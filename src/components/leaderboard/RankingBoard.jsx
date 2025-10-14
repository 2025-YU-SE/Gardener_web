import React, { useMemo, useState } from "react";
import samplePosts from "../postcontext.jsx";
import { TbCoin } from "react-icons/tb";
import profile from "../../assets/profile.png";

// 포인트 기준 내림차순으로 정렬해 랭킹 배열 생성
function rankByPoints(posts) {
  return [...posts]
    .sort((a, b) => b.points - a.points)
    .map((post, idx) => ({
      rank: idx + 1, // 1부터 시작하는 등수
      name: post.author, // 사용자 이름
      score: post.points, // 포인트
      profileImage: profile, // 임시 프로필 이미지 -> 추후 연동
    }));
}

function RankingBoard() {
  const ranked = useMemo(() => rankByPoints(samplePosts, profile), []);

  const DEFAULT_COUNT = 10; // 기본 표시 인원
  const MAX_EXPANDED = 50; // 더보기로 펼칠 수 있는 최대 인원

  // 전체 순위에서 표시할 총 인원(Top3 포함)
  const [showCount, setShowCount] = useState(DEFAULT_COUNT);

  // 상단 Top3 데이터(1~3위)
  const top3 = ranked.slice(0, 3);

  // 실제로 표시 가능한 최대 인원(데이터 수와 상한 중 더 작은 값)
  const maxShowable = Math.min(ranked.length, MAX_EXPANDED);

  // 목록에서 4위 ~ showCount 까지 잘라낸 데이터
  const rest = ranked.slice(3, Math.min(showCount, maxShowable));

  // 버튼 활성/비활성 판단 값
  const isAtDefault = showCount === DEFAULT_COUNT; // 접기 비활성 조건(이미 기본 상태)
  const isAtMax = showCount >= maxShowable; // 더보기 비활성 조건(이미 최대로 펼친 상태)

  // 더보기: 한 번에 maxShowable 까지 펼침
  const handleMore = () => setShowCount(maxShowable);

  // 접기: 기본 인원으로 복귀
  const handleCollapse = () => setShowCount(DEFAULT_COUNT);

  // 상단 TOP 3 전용 카드
  const TopCard = ({ rank, name, score, profileImage, tone = "neutral" }) => {
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
            src={profile}
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
            {score.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  // 4위 이하 일반 리스트용 카드
  const RowCard = ({ rank, name, score, profileImage }) => (
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
              src={profile}
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

  // Top3 개별 참조(가독성)
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="mt-8">
      {/* 상단 TOP 3 영역 */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white/70 p-4">
        <div className="text-center mb-4">
          <h3 className="text-[14px] font-semibold">🏆 명예의 전당 TOP 3</h3>
        </div>

        <div className="flex items-end justify-center gap-4">
          <div className="translate-y-2">
            {second && <TopCard {...second} tone="silver" />}
          </div>
          <div className="-translate-y-2">
            {first && <TopCard {...first} tone="gold" />}
          </div>
          <div className="translate-y-2">
            {third && <TopCard {...third} tone="bronze" />}
          </div>
        </div>
      </div>

      {/* 전체 순위 영역 */}
      <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white/70">
        {/* 헤더: 제목 + 표시 인원 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
          <div className="text-[13px] text-[#111827]">전체 순위</div>
          <div className="text-[12px] text-[#6B7280]">
            {/* 예: 123명 중 10명 표시 */}
            {ranked.length}명 중 {Math.min(showCount, maxShowable)}명 표시
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
            {/* 더보기: 이미 최대로 펼쳐진 경우 비활성화 */}
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

            {/* 접기: 이미 기본 상태면 비활성화 */}
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
