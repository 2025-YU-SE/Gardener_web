import React from "react";
import Header from "../components/header/Header";
import StatCard from "../components/leaderboard/StatCard";
import LeaderboardTabs from "../components/leaderboard/LeaderboardTabs";
import icon1 from "../assets/leaderboard_icon1.png";
import icon2 from "../assets/leaderboard_icon2.png";
import icon3 from "../assets/leaderboard_icon3.png";
import icon4 from "../assets/leaderboard_icon4.png";
import RankingBoard from "../components/leaderboard/RankingBoard.jsx";

function LeaderBoard() {
  // value값은 추후 연동해야함
  const stats = [
    { icon: icon1, value: 24, unit: "명", label: "이번 주 신규 가드너" },
    { icon: icon2, value: 127, unit: "%", label: "평균 성장률" },
    { icon: icon3, value: 15670, unit: "점", label: "이번 달 최고 기록" },
    { icon: icon4, value: 8.3, unit: "개", label: "평균 완료 과제" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <div className="mt-8">
        {/* 타이틀 + 소개 텍스트 */}
        <div className="text-center">
          <h1 className="text-[30px] font-semibold">리더보드</h1>
          <p className="mt-2 text-[14px] text-[#4D4D4D]">
            Code Gardener에서 가장 활발한 가드너들을 만나보세요
          </p>
        </div>

        <div className="mx-auto max-w-[1080px] w-full">
          {/* 지표 카드 4개 */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {stats.map((item, idx) => (
              <StatCard
                key={idx}
                icon={item.icon}
                value={item.value}
                unit={item.unit}
                label={item.label}
              />
            ))}
          </div>

          {/* 정렬 탭 */}
          <LeaderboardTabs />

          {/* 랭킹보드 */}
          <RankingBoard />

          {/* Footer */}
          <div className="w-full flex justify-center my-8">
            <div className="w-full max-w-[1248px] px-8 py-8 rounded-[10px] bg-gradient-to-r from-[#F0FDF4] to-[#EFF6FF] border border-[#E5E7EB] text-center shadow-sm">
              <div className="flex justify-center items-center gap-2 mb-1">
                <span className="text-[15px] font-medium text-[#4D4D4D]">
                  🌱 함께 성장하는
                  <span className="text-[#65C676]"> Code Gardener </span>
                  커뮤니티
                </span>
              </div>
              <p className="text-[12px] text-[#4A5565]">
                총 15명의 개발자가 함께 코드를 키우고 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
